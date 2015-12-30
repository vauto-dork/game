module CreateGame {
	export interface ICreateGameService {
		init(): ng.IPromise<void>;
		playerSort: NewGameSort;
		isFirstGameOfMonth(): boolean;
		getAllPlayers(): Shared.INewGamePlayer[];
		getSelectedPlayers(): Shared.INewGamePlayer[];
		getUnselectedPlayers(): Shared.INewGamePlayer[];
		selectPlayer(player: Shared.INewGamePlayer): void;
		deselectPlayer(player: Shared.INewGamePlayer): void;
		reset(): void;
		numberSelectedPlayers(): number;
		createNewActiveGame(): ng.IPromise<string>;
	}

	export enum NewGameSort {
		Selected,
		Rating
	}

	export class CreateGameService implements ICreateGameService {
		public static $inject: string[] = ['$q', 'apiService'];
		private firstGameOfMonth: boolean = false;
		private players: Shared.INewGamePlayer[] = [];
		
		private selected: string[] = [];
		private sort: NewGameSort = NewGameSort.Selected;
		private playerLoadPromise: ng.IPromise<void>;
		
		public get playerSort(): NewGameSort {
			return this.sort;
		}
		
		public set playerSort(value: NewGameSort) {
			this.sort = value;
		}

		constructor(private $q: ng.IQService, private apiService: Shared.IApiService) {
			this.getPlayers();
		}

		private getPlayers(): void {
			var def = this.$q.defer<void>();
			
			this.apiService.getPlayersForNewGame().then(data => {
				this.firstGameOfMonth = data.firstGameOfMonth;
				this.players = data.players;
				this.reset();
				def.resolve();
			}, () => {
				this.firstGameOfMonth = true;
				this.players = [];
				this.reset();
				def.resolve();
			});
			
			this.playerLoadPromise = def.promise;
		}
		
		private isPlayerSelected(player: Shared.IPlayer): boolean {
			return this.selected.indexOf(player._id) > -1;
		}
		
		public init(): ng.IPromise<void> {
			return this.playerLoadPromise;
		}

		public isFirstGameOfMonth(): boolean {
			return this.firstGameOfMonth;
		}
		
		public getAllPlayers(): Shared.INewGamePlayer[] {
			return this.players;
		}

		public getSelectedPlayers(): Shared.INewGamePlayer[] {
			var selection: Shared.INewGamePlayer[] = [];
			
			this.selected.forEach(playerId => {
				var found = this.players.filter(player => {
					return player.player._id === playerId;
				});
				
				if(found.length === 1) {
					selection.push(found[0]);
				}
			});
			
			if (this.sort === NewGameSort.Rating) {
				selection.sort((a, b) => {
					return b.rating - a.rating;
				});
			}
			
			return selection;
		}
		
		public getUnselectedPlayers(): Shared.INewGamePlayer[] {
			// This function just returns the list alphabetically.
			return this.players.filter((player) => {
				return !this.isPlayerSelected(player.player);
			});
		}

		public selectPlayer(player: Shared.INewGamePlayer): void {
			if (!this.isPlayerSelected(player.player)) {
				this.selected.push(player.player._id);
			}
		}

		public deselectPlayer(player: Shared.INewGamePlayer): void {
			var index = this.selected.indexOf(player.player._id);
			if (index > -1) {
				this.selected.splice(index, 1);
			}
		}

		public reset(): void {
			this.selected = [];
			this.playerSort = NewGameSort.Selected;
		}
		
		public numberSelectedPlayers(): number {
			if (!this.selected) {
				return 0;
			}
			
			return this.selected.length;
		}

		public createNewActiveGame(): ng.IPromise<string> {			
			var game = new Shared.Game();
			game.players = this.getSelectedPlayers().map((player) => {
				var gamePlayer = new Shared.GamePlayer();
				gamePlayer.player = player.player;
				return gamePlayer;
			});

			return this.apiService.createActiveGame(game);
		}
    }
}