module EditActiveGame {
    export interface IEditActiveGameService {
        datePlayed: Date;
        players: Shared.IGamePlayer[];
        curatedNewPlayers: Shared.INewGamePlayer[];
        showModifyPlayers: boolean;

        addPlayer(player: Shared.IGamePlayer): void;
        removePlayer(player: Shared.IGamePlayer): void;
        playerIndex(playerId: string): number;
        toggleModifyPlayers(): void;
        getErrorMessages(): string[];
        getActiveGame(): ng.IPromise<void>;
        save(): ng.IPromise<void>;
        finalize(): ng.IPromise<void>;
    }

    export class EditActiveGameService extends Shared.PubSubServiceBase implements IEditActiveGameService {
        public static $inject: string[] = ['$location', '$q', '$timeout', 'apiService'];
        private imLoading: ng.IPromise<void>;
        private gameIdPath: string;
        private activeGame: Shared.IGame;
        private allPlayers: Shared.INewGamePlayer[];
        private curatedPlayersList: Shared.INewGamePlayer[];
        private showModifyPlayersScreen: boolean;

        private eventPlaylistUpdate: string = "eventPlaylistUpdate";
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

        public get showModifyPlayers(): boolean {
            return this.showModifyPlayersScreen;
        }
        
        public getErrorMessages(): string[] {
            return this.errorMessages;
        }

        public get players(): Shared.IGamePlayer[] {
            return this.activeGame.players;
        }

        public set players(value: Shared.IGamePlayer[]) {
            this.activeGame.players = value;
        }

        public get curatedNewPlayers(): Shared.INewGamePlayer[] {
            return this.curatedPlayersList;
        }

        constructor(private $location: ng.ILocationService,
            private $q: ng.IQService,
            $timeout: ng.ITimeoutService,
            private apiService: Shared.IApiService) {
            super($timeout);
        }

        public toggleModifyPlayers(): void {
            this.showModifyPlayersScreen = !this.showModifyPlayersScreen;
        }
        
        public getActiveGame(): ng.IPromise<void> {
            var def = this.$q.defer<void>();
            
            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }

            var allPlayersPromise = this.getAllPlayers();
            allPlayersPromise.then((data) => {
                this.allPlayers = data;
            });

            var activeGamePromise = this.apiService.getActiveGame(this.gameIdPath);
            activeGamePromise.then((game) => {
                this.activeGame = game;
                def.resolve();
            }, () => {
                this.addErrorMessage('Cannot get active game.');
                def.reject();
            });

            this.$q.all([allPlayersPromise, activeGamePromise]).then(() => {
                this.curateNewPlayerList();
            });

            return def.promise;
        }

        private getAllPlayers(): ng.IPromise<Shared.INewGamePlayer[]> {
            var def = this.$q.defer<Shared.INewGamePlayer[]>();

            this.apiService.getPlayersForNewGame().then(data => {
                def.resolve(data.players);
            }, () => {
                def.reject();
            });

            return def.promise;
        }

        private curateNewPlayerList(): void {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.players.map(p => p.playerId);

            // Get players that are not in the current playlist.
            this.curatedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        }

        public playerIndex(playerId: string): number {
            return this.players.map(p => { return p.playerId; }).indexOf(playerId);
        }

        public addPlayer(player: Shared.IGamePlayer): void {
            this.players.push(player);
            this.curateNewPlayerList();
        }

        public removePlayer(player: Shared.IGamePlayer): void {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
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

            if (this.filterRemovedPlayers() && this.hasRanks()) {
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
            if (this.players.length < 3) {
                this.addErrorMessage('Game cannot have less than three players.');
                return false;
            }
            
            // Convert blank points to zeroes.
            this.players.forEach((player) => {
                player.points = !player.points ? 0 : player.points;
            });

            return true;
        }
        
        private hasRanks(): boolean {
            this.clearErrorMessages();
            
            var rank1 = this.players.filter((value) => {return value.rank === 1;}).length;
            var rank2 = this.players.filter((value) => {return value.rank === 2;}).length;
            var rank3 = this.players.filter((value) => {return value.rank === 3;}).length;
            
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
                var winner = this.players.filter((player) => { return player.rank === 1; });
                this.activeGame.winner = winner[0].player;
            }
            
            return hasRanks;
        }
    }
}