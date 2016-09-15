module CreateGame {
	export interface ICreateGameService {
		playersSorted: Shared.INewGamePlayer[];
		sortOrder: NewGameSort;
		unselectedPlayers: Shared.INewGamePlayer[];
		hasMinimumPlayers: boolean;
		numPlayers: number;

        init(): ng.IPromise<void>;
        reset(): void;
		addPlayer(player: Shared.INewGamePlayer): void;
        removePlayer(player: Shared.INewGamePlayer): void;
		createNewActiveGame(datePlayed: Date): ng.IPromise<string>;
	}

	export enum NewGameSort {
		Selected,
		Rating
	}

	export class CreateGameService implements ICreateGameService {
        public static $inject: string[] = ["$q", "apiService", "playerSelectionService", "newPlayerPanelService"];
		private firstGameOfMonth: boolean = false;
		private gameOrderSortedPlayers: Shared.INewGamePlayer[] = [];
        
		private sort: NewGameSort = NewGameSort.Selected;
		private playerLoadPromise: ng.IPromise<void>;

        private get players(): Shared.INewGamePlayer[] {
            return this.playerSelectionService.selectedPlayers;
        }

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
		    return this.playerSelectionService.unselectedPlayers;
		}

		public get hasMinimumPlayers(): boolean {
            return this.players.length >= 3;
        }

		public get numPlayers(): number {
			return this.players.length;
		}

        constructor(private $q: ng.IQService,
            private apiService: Shared.IApiService,
            private playerSelectionService: Components.IPlayerSelectionService,
            private newPlayerPanelService: Components.INewPlayerPanelService) {
            this.playerLoadPromise = this.playerSelectionService.getPlayers().then((data) => {
                this.initializeData(data.firstGameOfMonth);
                this.$q.resolve();
            }, () => {
                this.initializeData(true);
                this.$q.resolve();
            });

            this.newPlayerPanelService.subscribeSavedPlayer((event, player: Shared.IPlayer)=>{
                this.playerSelectionService.getPlayers().then(() => {
                    this.playerSelectionService.addPlayer(player);
                });
            });
        }
        
		private initializeData(firstGameOfMonth: boolean): void {
			this.firstGameOfMonth = firstGameOfMonth;
			this.reset();
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
        
		public reset(): void {
            this.playerSelectionService.reset();
            this.sortPlayersByGameOrder();
			this.sortOrder = NewGameSort.Selected;
        }

        public addPlayer(player: Shared.INewGamePlayer): void {
            this.playerSelectionService.addPlayer(player.player);
            this.sortPlayersByGameOrder();
        }

        public removePlayer(player: Shared.INewGamePlayer): void {
            this.playerSelectionService.removePlayer(player.player);
            this.sortPlayersByGameOrder();
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

        private debugShowSortedPlayersTable(): void {
            this.playerSelectionService.debugPrintPlayersTable(this.playersSorted);
        }
    }
}