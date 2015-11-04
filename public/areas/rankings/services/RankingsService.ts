module Rankings {
	export interface IRankingsService {
		GetRankings(mon, yr, hideUnranked): ng.IPromise<any>;
		GetAllPlayers(): Shared.IRankedPlayer[];
		GetPlayersOverTenGames(): Shared.IRankedPlayer[];
		GetPlayersUnderTenGames(): Shared.IRankedPlayer[];
	}

	enum PlayerSelection {
		All,
		OverTen,
		UnderTen
	};

	export class RankingsService implements IRankingsService {
		public static $inject: string[] = ['$http', '$q'];

		private cachedPlayers: Shared.IRankedPlayer[] = [];

		constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

		}

		public GetRankings(month: number, year: number, hideUnranked: boolean) {
			var def = this.$q.defer();

			month = !month ? new Date().getMonth() : month;
			year = !year ? new Date().getFullYear() : year;

			var unrankedParam = hideUnranked ? '&hideUnranked=true' : '';
			var rankedUrl = '/players/ranked?month=' + month + '&year=' + year + unrankedParam;

			this.$http.get(rankedUrl)
				.success((data: Shared.IRankedPlayerViewModel[], status, headers, config) => {
					this.cachedPlayers = data.map((value: Shared.IRankedPlayerViewModel) => {
						return new Shared.RankedPlayer(value); 
					});
					
					def.resolve();
				})
				.error((data, status, headers, config) => {
					def.reject(data);
				});

			return def.promise;
		}
		
		public GetAllPlayers(): Shared.IRankedPlayer[] {
			return this.getPlayers(PlayerSelection.All);
		}
		
		public GetPlayersOverTenGames(): Shared.IRankedPlayer[] {
			return this.getPlayers(PlayerSelection.OverTen);
		}
		
		public GetPlayersUnderTenGames(): Shared.IRankedPlayer[] {
			return this.getPlayers(PlayerSelection.UnderTen);
		}
		
		private getPlayers(playerSelection: PlayerSelection): Shared.IRankedPlayer[] {
			switch (playerSelection) {
				case PlayerSelection.UnderTen:
					var underTen = this.cachedPlayers.filter((player) => {
						return player.gamesPlayed < 10;
					});
					
					return this.rankPlayers(underTen);
					
				case PlayerSelection.OverTen:
					var overTen = this.cachedPlayers.filter((player) => {
						return player.gamesPlayed >= 10;
					});
					
					return this.rankPlayers(overTen);
				
				default:
					return this.rankPlayers(this.cachedPlayers);
			}
		};
		
		private rankPlayers(selectedPlayers: Shared.IRankedPlayer[]): Shared.IRankedPlayer[] {
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
