module CreateGame {
	export interface ICreateGameService {
		playersSorted: Shared.INewGamePlayer[];
		sortOrder: NewGameSort;
		curatedNewPlayers: Shared.INewGamePlayer[];
		hasMinimumPlayers: boolean;
		numPlayers: number;

		init(): ng.IPromise<void>;
		addPlayer(player: Shared.INewGamePlayer): void;
        removePlayer(player: Shared.INewGamePlayer): void;
        playerIndex(playerId: string): number;
		reset(): void;
		createNewActiveGame(datePlayed: Date): ng.IPromise<string>;
	}

	export enum NewGameSort {
		Selected,
		Rating
	}

	export class CreateGameService implements ICreateGameService {
		public static $inject: string[] = ['$q', 'apiService'];
		private firstGameOfMonth: boolean = false;
		private players: Shared.INewGamePlayer[] = [];
		private gameOrderSortedPlayers: Shared.INewGamePlayer[] = [];

		private allPlayers: Shared.INewGamePlayer[];
        private curatedPlayersList: Shared.INewGamePlayer[];

		private sort: NewGameSort = NewGameSort.Selected;
		private playerLoadPromise: ng.IPromise<void>;

		public get sortOrder(): NewGameSort {
			return this.sort;
		}

		public set sortOrder(value: NewGameSort) {
			this.sort = value;
		}

		public get playersSorted(): Shared.INewGamePlayer[] {
			if (this.sort === NewGameSort.Selected) {
				return this.players;
			}
			else {
				return this.gameOrderSortedPlayers;
			}
		}

		public get curatedNewPlayers(): Shared.INewGamePlayer[] {
            return this.curatedPlayersList;
        }

		public get hasMinimumPlayers(): boolean {
            return this.players.length >= 3;
        }

		public get numPlayers(): number {
			return this.players.length;
		}

		constructor(private $q: ng.IQService, private apiService: Shared.IApiService) {
			this.getPlayers();
		}

		private getPlayers(): void {
			var def = this.$q.defer<void>();

			this.apiService.getPlayersForNewGame().then(data => {
				this.initializeData(data.firstGameOfMonth, data.players);
				def.resolve();
			}, () => {
				// We still resolve because we just initialize default data
				this.initializeData(true, []);
				def.resolve();
			});

			this.playerLoadPromise = def.promise;
		}

		private initializeData(firstGameOfMonth: boolean, players: Shared.INewGamePlayer[]): void {
			this.firstGameOfMonth = firstGameOfMonth;
			this.allPlayers = players;
			this.reset();
			this.curateNewPlayerList();
		}

		private curateNewPlayerList(): void {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.players.map(p => p.playerId);

            // Get players that are not in the current playlist.
            this.curatedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });

			this.gameOrderSortedPlayers = angular.copy(this.players);
			this.gameOrderSortedPlayers.sort((a, b) => {
				return b.rating - a.rating;
			});
        }

		public init(): ng.IPromise<void> {
			return this.playerLoadPromise;
		}

		public playerIndex(playerId: string): number {
            return this.players.map(p => { return p.playerId; }).indexOf(playerId);
        }

        public addPlayer(player: Shared.INewGamePlayer): void {
            this.players.push(player);
            this.curateNewPlayerList();
        }

        public removePlayer(player: Shared.INewGamePlayer): void {
            var index = this.playerIndex(player.playerId);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        }

		public reset(): void {
			this.players = [];
			this.curateNewPlayerList();
			this.sortOrder = NewGameSort.Selected;
		}

		public createNewActiveGame(datePlayed: Date): ng.IPromise<string> {
			var game = new Shared.Game();
			game.datePlayed = datePlayed.toISOString();
			game.players = this.playersSorted.map((player) => {
				var gamePlayer = new Shared.GamePlayer();
				gamePlayer.player = player.player;
				return gamePlayer;
			});

			return this.apiService.createActiveGame(game);
		}
    }
}