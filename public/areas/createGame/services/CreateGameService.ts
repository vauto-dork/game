module CreateGame {
	export interface ICreateGameService {
		playersSorted: Shared.INewGamePlayer[];
		sortOrder: NewGameSort;
		unselectedPlayers: Shared.INewGamePlayer[];
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
        private unselectedPlayersList: Shared.INewGamePlayer[];

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

		public get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.unselectedPlayersList;
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
            this.unselectedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });

            this.sortPlayersByGameOrder();
        }

        private sortPlayersByGameOrder(): void {
            // Sorts in an alternating outside-in order by rating.
            // For example if the players have the following rating:
            //     1 2 3 4 5 6
            // They would be sorted like so:
            //     6 4 2 1 3 5
            
            var temp = angular.copy(this.players);
            temp.sort((a, b) => {
                if (a.rating !== b.rating) {
                    return b.rating - a.rating;
                } else if (a.orderNumber !== b.orderNumber) {
                    return a.orderNumber - b.orderNumber;
                } else {
                    if (a.player.fullname < b.player.fullname) {
                        return -1;
                    } else if (a.player.fullname > b.player.fullname) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });
            
            var first = true;
            var firstHalf: Shared.INewGamePlayer[] = [];
            var secondHalf: Shared.INewGamePlayer[] = [];
            while (temp.length > 0) {
                if (first) {
                    firstHalf.push(temp[0]);
                } else {
                    secondHalf.push(temp[0]);
                }
                
                temp.splice(0, 1);

                first = !first;
            }

            this.gameOrderSortedPlayers = [];

            firstHalf.forEach(p => {
                this.gameOrderSortedPlayers.push(p);
            });

            secondHalf.reverse().forEach(p => {
                this.gameOrderSortedPlayers.push(p);
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

        // Debug functions

        private debugShowAllPlayersTable(): void {
            this.debugPrintPlayersTable(this.allPlayers);
        }

        private debugShowCuratedPlayersTable(): void {
            this.debugPrintPlayersTable(this.unselectedPlayers);
        }

        private debugShowSortedPlayersTable(): void {
            this.debugPrintPlayersTable(this.playersSorted);
        }

        private debugPrintPlayersTable(players: Shared.INewGamePlayer[]): void {
            // Change "info" to "table" to show as table in browser debugger
            console.info(players.map((p) => {
                return {
                    orderNumber: p.orderNumber,
                    rating: p.rating,
                    name: p.player.fullname
                };
            }));
        }
    }
}