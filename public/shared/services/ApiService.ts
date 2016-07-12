module Shared {
	export interface IApiService {
		getAllActiveGames(): ng.IPromise<IGame[]>;
		getActiveGame(gameIdPath: string): ng.IPromise<IGame>;
		getPlayersForNewGame(): ng.IPromise<INewGame>;
		createActiveGame(game: IGame): ng.IPromise<string>;
		saveActiveGame(gameIdPath: string, game: IGame): ng.IPromise<void>;
		deleteActiveGame(gameIdPath: string): ng.IPromise<void>;
		saveNewPlayer(player: IPlayer): ng.IPromise<void>;
		saveExistingPlayer(player: IPlayer): ng.IPromise<void>;
		getAllPlayers(): ng.IPromise<IPlayer[]>;
		getRankedPlayers(month: number, year: number, hideUnranked: boolean): ng.IPromise<IRankedPlayer[]>;
		getDotm(month: number, year: number): ng.IPromise<IDotmViewModel>;
		getLastPlayedGame(): ng.IPromise<IGame>;
		getGames(month: number, year: number): ng.IPromise<IGame[]>;
		finalizeGame(game: IGame): ng.IPromise<void>;
		deleteGame(gameIdPath: string): ng.IPromise<void>;
	}

	export class ApiService implements IApiService {
		public static $inject: string[] = ['$http', '$q'];

		constructor(private $http: ng.IHttpService, private $q: ng.IQService) {

		}
		
		// --------------------------------------------------------------
		// Active Games
	
		private getActiveGamePath(gameIdPath: string): string {
			return '/ActiveGames/json' + gameIdPath;
		}
		
		private getEditActiveGamePath(gameId: string): string {
			return '/activeGames/edit/#/' + gameId;
		}
		
		public getAllActiveGames(): ng.IPromise<IGame[]> {
			var def = this.$q.defer<IGame[]>();

			this.$http.get(this.getActiveGamePath(''))
				.success((data: IGameViewModel[], status, headers, config) => {
					if (data === null || data === undefined) {
						def.reject(status);
					}
					else {
						var game: IGame[] = data.map((value: IGameViewModel) => {
							return new Game(value);
						});
						
						def.resolve(game);
					}
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot get active games`);
					def.reject(data);
				});

			return def.promise;
		}

		public getActiveGame(gameIdPath: string): ng.IPromise<IGame> {
			var def = this.$q.defer<IGame>();

			this.$http.get(this.getActiveGamePath(gameIdPath))
				.success((data: IGameViewModel, status, headers, config) => {
					if (data === null || data === undefined) {
						def.reject(status);
					}
					else {
						def.resolve(new Game(data));
					}
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot get game with id ${gameIdPath}`);
					def.reject(data);
				});

			return def.promise;
		}
		
		public getPlayersForNewGame(): ng.IPromise<INewGame> {
			var def = this.$q.defer<INewGame>();
			
			this.$http.get('/players/newgame')
				.success((data: ICreateGameViewModel, status, headers, config) => {
					def.resolve(new NewGame(data));
				})
				.error((data, status, headers, config) => {
					console.error('Cannot get players for new game');
					def.reject(data);
				});
			
			return def.promise;
		}

		public createActiveGame(game: IGame): ng.IPromise<string> {
			var def = this.$q.defer<string>();
			
			var gameViewModel = game.toGameViewModel();

			this.$http.post('/activeGames/save', gameViewModel)
				.success((data: IGameViewModel, status, headers, config) => {
					def.resolve(this.getEditActiveGamePath(data._id));
				})
				.error((data, status, headers, config) => {
					console.error('Cannot create active game');
					def.reject(data);
				});

			return def.promise;
		}

		public saveActiveGame(gameIdPath: string, game: IGame): ng.IPromise<void> {
			var def = this.$q.defer<void>();

			this.$http.put(this.getActiveGamePath(gameIdPath), game)
				.success((data, status, headers, config) => {
					def.resolve();
				}).
				error((data, status, headers, config) => {
					console.error(`Cannot save active game with id ${gameIdPath}`);
					def.reject(data);
				});

			return def.promise;
		}

		public deleteActiveGame(gameIdPath: string): ng.IPromise<void> {
			var def = this.$q.defer<void>();

			this.$http.delete(this.getActiveGamePath(gameIdPath))
				.success((data, status, headers, config) => {
					def.resolve();
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot delete active game with id ${gameIdPath}`)
					def.reject(data);
				});

			return def.promise;
		}
	
		// --------------------------------------------------------------
		// Players
		
		public saveNewPlayer(player: IPlayer): ng.IPromise<void> {
			var def = this.$q.defer<void>();
			
			this.$http.post('/players', player)
				.success((data, status, headers, config) => {
					def.resolve();
				}).error((data, status, headers, config) => {
					console.error('Cannot save player.');
					def.reject(data);
				});
				
			return def.promise;
		}
		
		public saveExistingPlayer(player: IPlayer): ng.IPromise<void> {
			var def = this.$q.defer<void>();
			
			this.$http.put('players/' + player._id, player)
				.success((data, status, headers, config) => {
					def.resolve();
				}).error((data, status, headers, config) => {
					console.error('Cannot save player.');
					def.reject(data);
				});
				
			return def.promise;
		}
	
		public getAllPlayers(): ng.IPromise<IPlayer[]> {
			var def = this.$q.defer<IPlayer[]>();

			this.$http.get('/players?sort=true')
				.success((data: IPlayerViewModel[], status, headers, config) => {
					var allPlayers: IPlayerViewModel[] = data;
					var formattedPlayers: IPlayer[] = this.playerNameFormat(allPlayers);
					def.resolve(formattedPlayers);
				})
				.error((data, status, headers, config) => {
					console.error('Cannot get all players.');
					def.reject(data);
				});

			return def.promise;
		}
		
		public getRankedPlayers(month: number, year: number, hideUnranked: boolean): ng.IPromise<IRankedPlayer[]> {
			var def = this.$q.defer<IRankedPlayer[]>();

			month = (month === undefined || month === null) ? new Date().getMonth() : month;
			year = (year === undefined || year === null) ? new Date().getFullYear() : year;

			var unrankedParam = hideUnranked ? '&hideUnranked=true' : '';
			var rankedUrl = '/players/ranked?month=' + month + '&year=' + year + unrankedParam;

			this.$http.get(rankedUrl)
				.success((data: IRankedPlayerViewModel[], status, headers, config) => {
					var players: IRankedPlayer[] = data.map((value: IRankedPlayerViewModel) => {
						return new RankedPlayer(value); 
					});
					
					def.resolve(players);
				})
				.error((data, status, headers, config) => {
					console.error('Cannot get ranked players.');
					def.reject(data);
				});

			return def.promise;
		}

		private playerNameFormat(rawPlayersList: IPlayerViewModel[]): IPlayer[] {
			var playersList: IPlayer[] = rawPlayersList.map((value: IPlayerViewModel) => {
				return new Player(value);
			});

			return playersList;
		}
		
		// --------------------------------------------------------------
		// Dork of the Month
		
		public getDotm(month: number, year: number): ng.IPromise<IDotmViewModel> {
			var def = this.$q.defer<IDotmViewModel>();

			var query: string = '?month=' + month + '&year=' + year;

			this.$http.get("/Players/dotm" + query)
				.success((data: IDotmViewModel, status, headers, config) => {
					def.resolve(data);
				}).
				error((data, status, headers, config) => {
					console.error('Cannot get dorks of the month.');
					def.reject(data);
				});

			return def.promise;
		}
	
		// --------------------------------------------------------------
		// Games
		
		public getLastPlayedGame(): ng.IPromise<IGame> {
			var def = this.$q.defer<IGame>();

			this.$http.get("/Games/LastPlayed")
				.success((data: IGameViewModel, status, headers, config) => {
					def.resolve(new Game(data));
				})
				.error((data, status, headers, config) => {
					console.error('Cannot get last game played.');
					def.reject(data);
				});

			return def.promise;
		}
		
		public getGames(month: number, year: number): ng.IPromise<IGame[]> {
			var def = this.$q.defer<IGame[]>();
			var path = '/Games?month=' + month + '&year=' + year;
			
			this.$http.get(path).success((data: IGameViewModel[], status, headers, config) => {
				var game: IGame[] = data.map((value: IGameViewModel) => {
					return new Game(value);
				});
				
				def.resolve(game);
			})
			.error((data, status, headers, config) => {
					console.error('Cannot get games played.');
					def.reject(data);
				});
				
			return def.promise;
		}

		public finalizeGame(game: IGame): ng.IPromise<void> {
			var def = this.$q.defer<void>();

			this.$http.post('/games', game.toGameViewModel()).success((data, status, headers, config) => {
				def.resolve();
			})
				.error((data, status, headers, config) => {
					console.error(`Cannot finalize game. Status code: ${status}.`);
					def.reject(data);
				});

			return def.promise;
		}

		public deleteGame(gameIdPath: string): ng.IPromise<void> {
			var def = this.$q.defer<void>();

			this.$http.delete(`/games${gameIdPath}`)
				.success((data, status, headers, config) => {
					def.resolve();
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot delete game with id ${gameIdPath}`)
					def.reject(data);
				});

			return def.promise;
		}
	}
}