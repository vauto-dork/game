module EnterScores {
    export interface IEnterScoresService {
        datePlayed: Date;
        unselectedPlayers: Shared.INewGamePlayer[];
        players: Shared.IGamePlayer[];
        state: ScoreFormState;

        init(): ng.IPromise<void>;
        reset(): void;
		addPlayer(player: Shared.INewGamePlayer): void;
        removePlayer(player: Shared.INewGamePlayer): void;
        createGame(): void;
    }

    export enum ScoreFormState {
        DateSelect,
        ScoreEntry
    }

    export class EnterScoresService implements IEnterScoresService {
        public static $inject: string[] = ["$q", "apiService", "playerSelectionService", "newPlayerPanelService"];

        private firstGameOfMonth: boolean = false;
        private playerLoadPromise: ng.IPromise<void>;
        private currentState: ScoreFormState;
        private gameId: string;

        private localDatePlayed: Date;
        private localPlayers: Shared.IGamePlayer[];

        public get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.playerSelectionService.unselectedPlayers;
        }

        public get players(): Shared.IGamePlayer[] {
            return this.localPlayers;
        }

        public set players(value: Shared.IGamePlayer[]) {
            this.localPlayers = value;
        }

        public get state(): ScoreFormState {
            return this.currentState;
        }

        public get datePlayed(): Date {
            return this.localDatePlayed;
        }

        public set datePlayed(value: Date) {
            this.localDatePlayed = value;
        }

        constructor(
            private $q: ng.IQService,
            private apiService: Shared.IApiService,
            private playerSelectionService: Components.IPlayerSelectionService,
            private newPlayerPanelService: Components.INewPlayerPanelService) {
            
            this.currentState = ScoreFormState.DateSelect;
            this.players = [];

            this.playerLoadPromise = this.playerSelectionService.getPlayers().then((data) => {
                this.initializeData(data.firstGameOfMonth);
                this.$q.resolve();
            }, () => {
                this.initializeData(true);
                this.$q.resolve();
            });

            this.newPlayerPanelService.subscribeSavedPlayer((event, player: Shared.IPlayer)=>{
                this.playerSelectionService.getPlayers().then(() => {
                    var newPlayer = new Shared.NewGamePlayer();
                    newPlayer.player = player;
                    newPlayer.orderNumber = 0;
                    newPlayer.rating = 0;
                    this.addPlayer(newPlayer);
                });
            });
        }

        private initializeData(firstGameOfMonth: boolean): void {
			this.firstGameOfMonth = firstGameOfMonth;
			this.reset();
		}

        public init(): ng.IPromise<void> {
			return this.playerLoadPromise;
		}

        public reset(): void {
            this.playerSelectionService.reset();
        }

        public playerIndex(playerId: string): number {
            return this.players.map(p => { return p.playerId; }).indexOf(playerId);
        }

        public createGame(): void {
            this.currentState = ScoreFormState.ScoreEntry;
        }

        public createNewActiveGame(datePlayed: Date): void {
			var game = new Shared.Game();
			game.datePlayed = datePlayed.toISOString();
			game.players = this.players;

			this.apiService.createActiveGame(game).then(editUrl => {
				this.gameId = editUrl;
			});
        }

        public addPlayer(player: Shared.INewGamePlayer): void {
            var gamePlayer = new Shared.GamePlayer();
            gamePlayer.player = player.player;

            this.players.push(gamePlayer);
            this.playerSelectionService.addPlayer(player.player);
        }

        public removePlayer(player: Shared.INewGamePlayer): void {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.playerSelectionService.removePlayer(player.player);
        }
    }
}