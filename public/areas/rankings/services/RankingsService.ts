module Rankings {
	export interface IRankingsService {
		getRankings(mon, yr, hideUnranked): ng.IPromise<void>;
		getAllPlayers(): Shared.IRankedPlayer[];
		getPlayersOverTenGames(): Shared.IRankedPlayer[];
		getPlayersUnderTenGames(): Shared.IRankedPlayer[];
	}

	enum PlayerSelection {
		All,
		OverTen,
		UnderTen
	};

	export class RankingsService implements IRankingsService {
		public static $inject: string[] = ['$q', 'apiService'];

		private cachedPlayers: Shared.IRankedPlayer[] = [];

		constructor(private $q: ng.IQService, private apiService: Shared.IApiService) {

		}

		public getRankings(month: number, year: number, hideUnranked: boolean): ng.IPromise<void> {
			var def = this.$q.defer<void>();
			
			this.apiService.getRankedPlayers(month, year, hideUnranked).then((data: Shared.IRankedPlayer[]) => {
				this.cachedPlayers = data;
				def.resolve();
			}, () => {
				def.reject();
			});
			
			return def.promise;
		}
		
		public getAllPlayers(): Shared.IRankedPlayer[] {
			return this.getPlayers(PlayerSelection.All);
		}
		
		public getPlayersOverTenGames(): Shared.IRankedPlayer[] {
			return this.getPlayers(PlayerSelection.OverTen);
		}
		
		public getPlayersUnderTenGames(): Shared.IRankedPlayer[] {
			return this.getPlayers(PlayerSelection.UnderTen);
		}
		
		private getPlayers(playerSelection: PlayerSelection): Shared.IRankedPlayer[] {
			switch (playerSelection) {
				case PlayerSelection.UnderTen:
					var underTen = this.cachedPlayers.filter((player) => {
						return player.gamesPlayed < 10;
					});
					
					return this.assignRankValue(underTen);
					
				case PlayerSelection.OverTen:
					var overTen = this.cachedPlayers.filter((player) => {
						return player.gamesPlayed >= 10;
					});
					
					return this.assignRankValue(overTen);
				
				default:
					return this.assignRankValue(this.cachedPlayers);
			}
		};
		
		private assignRankValue(selectedPlayers: Shared.IRankedPlayer[]): Shared.IRankedPlayer[] {
			var counter = 0;

			selectedPlayers.forEach((player: Shared.IRankedPlayer, index: number) => {
				if (!player.gamesPlayed) {
					player.rank = 0;
				}
				else if (index > 0 && player.rating === selectedPlayers[index - 1].rating) {
					player.rank = counter;
				}
				else {
					player.rank = ++counter;
				}
			});

			return selectedPlayers;
		}
    }
}
