module EditActiveGame {
    export interface IEditActiveGameService {
        datePlayed: Date;
        getErrorMessages(): string[];
        getActiveGame(): ng.IPromise<void>;
        save(): ng.IPromise<void>;
        finalize(): ng.IPromise<void>;
    }

    export class EditActiveGameService implements IEditActiveGameService {
        public static $inject: string[] = ['$location', '$q'];
        private imLoading: ng.IPromise<void>;
        private gameIdPath: string;
        private activeGame: Shared.IGame;
        
        private errorMessages: string[] = [];

        public get datePlayed(): Date {
            if (this.activeGame && this.activeGame.datePlayed) {
                return new Date(this.activeGame.datePlayed);
            }

            return null;
        }

        public set datePlayed(value: Date) {
            if (this.activeGame) {
                this.activeGame.datePlayed = value.toISOString();
            }
        }
        
        public getErrorMessages(): string[] {
            return this.errorMessages;
        }

        constructor(private $location: ng.ILocationService, private $q: ng.IQService, private apiService: Shared.IApiService) {
            
        }
        
        public getActiveGame(): ng.IPromise<void> {
            var def = this.$q.defer<void>();
            
            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }

            this.apiService.getActiveGame(this.gameIdPath).then((game) => {
                this.activeGame = game;
                def.resolve();
            }, () => {
                this.addErrorMessage('Cannot get active game.');
                def.reject();
            });

            return def.promise;
        }

        public save(): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            if (this.filterRemovedPlayers()) {
                this.apiService.saveActiveGame(this.gameIdPath, this.activeGame).then(() => {
                    def.resolve();
                }, () => {
                    this.addErrorMessage('Cannot save active game.');
                    def.reject();
                });
            } else {
                def.reject();
            }
            return def.promise;
        }

        public finalize(): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            if(this.hasRanks() && this.filterRemovedPlayers()) {
                this.apiService.finalizeGame(this.activeGame).then(() => {
                    this.apiService.deleteActiveGame(this.gameIdPath).then(() => {
                        def.resolve();
                    }, () => {
                        this.addErrorMessage('Cannot delete active game.');
                        def.reject();
                    });
                }, () => {
                    this.addErrorMessage('Cannot finalize active game.');
                    def.reject();
                });
            } else {
                def.reject();
            }
            
            return def.promise;
        }
        
        private addErrorMessage(message: string, clear: boolean = true) {
            if(clear) {
                this.clearErrorMessages();
            }
            
            this.errorMessages.push(message);
        }
        
        private clearErrorMessages() {
            this.errorMessages = [];
        }

        private filterRemovedPlayers(): boolean {
            var remainingPlayers = this.activeGame.players.filter((player) => {
                return !player.removed;
            });

            if (remainingPlayers.length < 3) {
                this.addErrorMessage('Game cannot have less than three players.');
                return false;
            }

            this.activeGame.players = remainingPlayers;
            
            // Convert blank points to zeroes.
            this.activeGame.players.forEach((player) => {
                player.points = !player.points ? 0 : player.points;
            });

            return true;
        }
        
        private hasRanks(): boolean {
            this.clearErrorMessages();
            
            var rank1 = this.activeGame.players.filter((value) => {return value.rank === 1;}).length;
            var rank2 = this.activeGame.players.filter((value) => {return value.rank === 2;}).length;
            var rank3 = this.activeGame.players.filter((value) => {return value.rank === 3;}).length;
            
            if(rank1 !== 1) {
                this.addErrorMessage('No winner selected.', false);
            }
            
            if(rank2 !== 1) {
                this.addErrorMessage('No second place selected.', false);
            }
            
            if(rank3 !== 1) {
                this.addErrorMessage('No third place selected.', false);
            }
            
            var hasRanks = (rank1 === 1 && rank2 === 1 && rank3 === 1);
            
            if(hasRanks) {
                var winner = this.activeGame.players.filter((player) => { return player.rank === 1; });
                this.activeGame.winner = winner[0].player;
            }
            
            return hasRanks;
        }
    }
}