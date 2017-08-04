module EditActiveGame {
    export interface IEditActiveGameService {
        gameType: FinalizeGameType;
        datePlayed: Date;
        players: Shared.IGamePlayer[];
        unselectedPlayers: Shared.INewGamePlayer[];
        movePlayerActive: boolean;
        errorMessages: string[];

        addPlayer(player: Shared.IGamePlayer): void;
        removePlayer(player: Shared.IGamePlayer): void;
        movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): void;
        playerIndex(playerId: string): number;
        getGame(gameType: FinalizeGameType): ng.IPromise<void>;
        save(): ng.IPromise<void>;
        finalize(): ng.IPromise<void>;
        updateFinalizedGame(): ng.IPromise<void>;
    }

    export enum FinalizeGameType {
        ActiveGame,
        FinalizedGame
    }

    export class EditActiveGameService implements IEditActiveGameService {
        public static $inject: string[] = ["$location", "$q", "apiService", "playerSelectionService", "newPlayerPanelService"];
                
        private imLoading: ng.IPromise<void>;
        private gameIdPath: string;
        private activeGame: Shared.IGame;
        private isMovePlayerActive: boolean;
        private errorMessageList: string[] = [];
        private localGameType: FinalizeGameType;
        
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

        public get gameType(): FinalizeGameType {
            return this.localGameType;
        }

        constructor(private $location: ng.ILocationService,
            private $q: ng.IQService,
            private apiService: Shared.IApiService,
            private playerSelectionService: Components.IPlayerSelectionService,
            private newPlayerPanelService: Components.INewPlayerPanelService) {
            
            this.newPlayerPanelService.subscribeSavedPlayer((event, player: Shared.IPlayer)=>{
                this.playerSelectionService.getPlayers().then(() => {
                    var newPlayer = new Shared.GamePlayer();
                    newPlayer.player = player;
                    newPlayer.points = 0;
                    newPlayer.rank = 0;
                    this.addPlayer(newPlayer);
                });
            });
        }

        public getGame(gameType: FinalizeGameType): ng.IPromise<void> {
            this.localGameType = gameType;
            var def = this.$q.defer<void>();

            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }

            var allPlayersPromise = this.playerSelectionService.getPlayers();

            var gamePromise = gameType === FinalizeGameType.ActiveGame
                ? this.apiService.getActiveGame(this.gameIdPath)
                : this.apiService.getFinalizedGame(this.gameIdPath);

            gamePromise.then((game) => {
                this.activeGame = game;
                def.resolve();
            }, () => {
                this.addErrorMessage('Cannot get active game.');
                def.reject();
            });

            this.$q.all([allPlayersPromise, gamePromise]).then(() => {
                this.players.forEach(p => {
                    this.playerSelectionService.addPlayer(p.player);
                });
            });

            return def.promise;
        }
        
        public playerIndex(playerId: string): number {
            return this.activeGame.getPlayerIndex(playerId);
        }

        public addPlayer(player: Shared.IGamePlayer): void {
            this.activeGame.addPlayer(player);
            this.playerSelectionService.addPlayer(player.player);
        }

        public removePlayer(player: Shared.IGamePlayer): void {
            this.activeGame.removePlayer(player);
            this.playerSelectionService.removePlayer(player.player);
        }

        public movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): void {
            var isSuccess = this.activeGame.movePlayer(selectedPlayerId, destinationPlayer);
            
            if(!isSuccess) {
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

        public finalize(): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            if (this.filterRemovedPlayers() && this.hasRanks()) {
                this.activeGame.addBonusPoints();

                this.apiService.finalizeGame(this.activeGame).then(() => {
                    this.apiService.deleteActiveGame(this.gameIdPath).then(() => {
                        def.resolve();
                    }, () => {
                        this.activeGame.removeBonusPoints();
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

        public updateFinalizedGame(): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            if (this.filterRemovedPlayers() && this.hasRanks()) {
                this.activeGame.addBonusPoints();

                this.apiService.updateFinalizeGame(this.activeGame).then(() => {
                    def.resolve();
                }, () => {
                    this.activeGame.removeBonusPoints();
                    this.addErrorMessage('Cannot update finalized game.');
                    def.reject();
                });
            } else {
                def.reject();
            }

            return def.promise;
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

            this.activeGame.convertNullPointsToZero();

            return true;
        }

        private hasRanks(): boolean {
            this.clearerrorMessageList();

            if (!this.activeGame.hasFirstPlace()) {
                this.addErrorMessage('No winner selected.', false);
            }

            if (!this.activeGame.hasSecondPlace()) {
                this.addErrorMessage('No second place selected.', false);
            }

            if (!this.activeGame.hasThirdPlace()) {
                this.addErrorMessage('No third place selected.', false);
            }

            return this.activeGame.declareWinner();
        }
    }
}