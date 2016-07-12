module EditActiveGame {
    export interface IEditActiveGameService {
        datePlayed: Date;
        players: Shared.IGamePlayer[];
        unselectedPlayers: Shared.INewGamePlayer[];
        showModifyPlaylist: boolean;
        movePlayerActive: boolean;
        errorMessages: string[];

        addPlayer(player: Shared.IGamePlayer): void;
        removePlayer(player: Shared.IGamePlayer): void;
        movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): void;
        playerIndex(playerId: string): number;
        toggleModifyPlaylist(): void;
        getActiveGame(): ng.IPromise<void>;
        save(): ng.IPromise<void>;
        finalize(addBonusPoints?: boolean): ng.IPromise<void>;
    }

    export class EditActiveGameService implements IEditActiveGameService {
        public static $inject: string[] = ['$location', '$q', 'apiService', 'playerSelectionService'];
        private imLoading: ng.IPromise<void>;
        private gameIdPath: string;
        private activeGame: Shared.IGame;
        private showModifyPlaylistScreen: boolean;
        private isMovePlayerActive: boolean;
        private errorMessageList: string[] = [];

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

        public get movePlayerActive(): boolean {
            return this.isMovePlayerActive;
        }

        public set movePlayerActive(value: boolean) {
            this.isMovePlayerActive = value;
        }

        public get showModifyPlaylist(): boolean {
            return this.showModifyPlaylistScreen;
        }

        public get errorMessages(): string[] {
            return this.errorMessageList;
        }

        public get players(): Shared.IGamePlayer[] {
            return this.activeGame.players;
        }

        public set players(value: Shared.IGamePlayer[]) {
            this.activeGame.players = value;
        }

        public get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.playerSelectionService.unselectedPlayers;
        }

        constructor(private $location: ng.ILocationService,
            private $q: ng.IQService,
            private apiService: Shared.IApiService,
            private playerSelectionService: Shared.IPlayerSelectionService) {
        }

        public toggleModifyPlaylist(): void {
            this.showModifyPlaylistScreen = !this.showModifyPlaylistScreen;
        }

        public getActiveGame(): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }

            var allPlayersPromise = this.playerSelectionService.getPlayers();

            var activeGamePromise = this.apiService.getActiveGame(this.gameIdPath);
            activeGamePromise.then((game) => {
                this.activeGame = game;
                def.resolve();
            }, () => {
                this.addErrorMessage('Cannot get active game.');
                def.reject();
            });

            this.$q.all([allPlayersPromise, activeGamePromise]).then(() => {
                this.players.forEach(p => {
                    this.playerSelectionService.addPlayer(p.player);
                });
            });

            return def.promise;
        }
        
        public playerIndex(playerId: string): number {
            return this.players.map(p => { return p.playerId; }).indexOf(playerId);
        }

        public addPlayer(player: Shared.IGamePlayer): void {
            this.players.push(player);
            this.playerSelectionService.addPlayer(player.player);
        }

        public removePlayer(player: Shared.IGamePlayer): void {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.playerSelectionService.removePlayer(player.player);
        }

        public movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): void {
            var selectedPlayer = this.players.filter(p => {
                return p.playerId === selectedPlayerId;
            });

            if (selectedPlayer.length === 1) {
                var selectedPlayerIndex = this.playerIndex(selectedPlayerId);
                this.players.splice(selectedPlayerIndex, 1);

                var dropIndex = this.playerIndex(destinationPlayer.playerId);

                if (selectedPlayerIndex <= dropIndex) {
                    dropIndex += 1;
                }

                this.players.splice(dropIndex, 0, selectedPlayer[0]);
            } else {
                console.error("Cannot find player: ", selectedPlayerId);
            }
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

        public finalize(addBonusPoints?: boolean): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            if (this.filterRemovedPlayers() && this.hasRanks()) {
                if (addBonusPoints) {
                    this.addBonusPoints();
                }

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

        private addBonusPoints(): void {
            var numPlayers = this.players.length;
            this.players.forEach(player => {
                if (player.rank === 1) {
                    player.points += numPlayers - 1;
                }
                if (player.rank === 2) {
                    player.points += numPlayers - 2;
                }
                if (player.rank === 3) {
                    player.points += numPlayers - 3;
                }
            });
        }

        private addErrorMessage(message: string, clear: boolean = true) {
            if (clear) {
                this.clearerrorMessageList();
            }

            this.errorMessageList.push(message);
        }

        private clearerrorMessageList() {
            this.errorMessageList = [];
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
            this.clearerrorMessageList();

            var rank1 = this.players.filter(value => { return value.rank === 1; }).length;
            var rank2 = this.players.filter(value => { return value.rank === 2; }).length;
            var rank3 = this.players.filter(value => { return value.rank === 3; }).length;

            if (rank1 !== 1) {
                this.addErrorMessage('No winner selected.', false);
            }

            if (rank2 !== 1) {
                this.addErrorMessage('No second place selected.', false);
            }

            if (rank3 !== 1) {
                this.addErrorMessage('No third place selected.', false);
            }

            var hasRanks = (rank1 === 1 && rank2 === 1 && rank3 === 1);

            if (hasRanks) {
                var winner = this.players.filter((player) => { return player.rank === 1; });
                this.activeGame.winner = winner[0].player;
            }

            return hasRanks;
        }
    }
}