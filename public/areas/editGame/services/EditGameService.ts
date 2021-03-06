module EditGame {
    import EditGameType = Shared.EditGameType;
    
    export interface IEditGameService {
        gameType: EditGameType;
        datePlayed: Date;
        players: Shared.IGamePlayer[];
        unselectedPlayers: Shared.INewGamePlayer[];
        movePlayerActive: boolean;
        errorMessages: string[];

        cleanRanks(playerChanged: Shared.IGamePlayer): void;
        addPlayer(player: Shared.IGamePlayer): void;
        removePlayer(player: Shared.IGamePlayer): void;
        movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): void;
        getGame(gameType: EditGameType): ng.IPromise<void>;
        save(): ng.IPromise<void>;
        finalize(): ng.IPromise<void>;
        updateFinalizedGame(): ng.IPromise<void>;
    }

    export class EditGameService implements IEditGameService {
        public static $inject: string[] = ["$location", "$q", "apiService", "playerSelectionService", "newPlayerPanelService"];
                
        private imLoading: ng.IPromise<void>;
        private gameIdPath: string;
        private activeGame: Shared.IGame;
        private isMovePlayerActive: boolean;
        private errorMessageList: string[] = [];
        private localGameType: EditGameType;
        
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

        public get gameType(): EditGameType {
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

        public getGame(gameType: EditGameType): ng.IPromise<void> {
            this.localGameType = gameType;
            var def = this.$q.defer<void>();

            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.gameIdPath = this.$location.path();
            }

            var allPlayersPromise = this.playerSelectionService.getPlayers();

            var gamePromise = gameType === EditGameType.ActiveGame
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

        public cleanRanks(playerChanged: Shared.IGamePlayer): void {
            this.activeGame.cleanRanks(playerChanged);
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