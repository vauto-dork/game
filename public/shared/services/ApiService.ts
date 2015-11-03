module Shared {
	export interface IApiService {
		GetActiveGame(gameIdPath: string): ng.IPromise<any>;
		CreateActiveGame(game: IActiveGameViewModel): ng.IPromise<any>;
		SaveActiveGame(gameIdPath: string, game: IGameViewModel): ng.IPromise<any>;
		DeleteActiveGame(gameIdPath: string): ng.IPromise<any>;
		GetAllPlayers(): ng.IPromise<any>;
		FinalizeGame(game: IGameViewModel): ng.IPromise<any>;
		DeleteGame(gameIdPath: string): ng.IPromise<any>;
	}

	export class ApiService implements IApiService {
		public static $inject: string[] = ['$http', '$q'];
		
		constructor(private $http: ng.IHttpService, private $q: ng.IQService) {
			
		}
		
		// --------------------------------------------------------------
		// Active Games
	
		private GetActiveGamePath(gameIdPath: string): string {
			return '/ActiveGames/json' + gameIdPath;
		};

		public GetActiveGame(gameIdPath: string): ng.IPromise<any> {
			var def = this.$q.defer();

			this.$http.get(this.GetActiveGamePath(gameIdPath))
				.success((data, status, headers, config) => {
					if (data === null || data === undefined) {
						def.reject(status);
					}
					else {
						def.resolve(data);
					}
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot get game with id ${gameIdPath}`);
					def.reject(data);
				});

			return def.promise;
		};
		
		public CreateActiveGame(game: IActiveGameViewModel): ng.IPromise<any> {
			var def = this.$q.defer();
			
			this.$http.post('/activeGames/save', game)
				.success((data: IGameViewModel, status, headers, config) => {
					def.resolve(data);
				})
				.error((data, status, headers, config) => {
					console.error('Cannot create active game');
					def.reject(data);
				});

			return def.promise;
		}

		public SaveActiveGame(gameIdPath: string, game: IGameViewModel): ng.IPromise<any> {
			var def = this.$q.defer();

			this.$http.put(this.GetActiveGamePath(gameIdPath), game)
				.success((data, status, headers, config) => {
					def.resolve();
				}).
				error((data, status, headers, config) => {
					console.error(`Cannot save active game with id ${gameIdPath}`);
					def.reject(data);
				});

			return def.promise;
		};

		public DeleteActiveGame(gameIdPath: string): ng.IPromise<any> {
			var def = this.$q.defer();

			this.$http.delete(this.GetActiveGamePath(gameIdPath))
				.success((data, status, headers, config) => {
					def.resolve();
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot delete active game with id ${gameIdPath}`)
					def.reject(data);
				});

			return def.promise;
		};
	
		// --------------------------------------------------------------
		// Get Players
	
		public GetAllPlayers(): ng.IPromise<any> {
			var def = this.$q.defer();

			this.$http.get('/players?sort=true')
				.success((data: IPlayerViewModel[], status, headers, config) => {
					var allPlayers: IPlayerViewModel[] = data;
					var formattedPlayers: IPlayer[] = this.PlayerNameFormat(allPlayers);
					def.resolve(formattedPlayers);
				})
				.error((data, status, headers, config) => {
					console.error('Cannot get all players.');
					def.reject(data);
				});

			return def.promise;
		};

		private PlayerNameFormat(rawPlayersList: IPlayerViewModel[]) {
			var playersList: IPlayer[] = rawPlayersList.map((value: IPlayerViewModel) => {
				return new Player(value);
			});

			return playersList;
		};
	
		// --------------------------------------------------------------
		// Games 
	
		public FinalizeGame(game: IGameViewModel): ng.IPromise<any> {
			var def = this.$q.defer();

			this.$http.post('/games', game).success((data, status, headers, config) => {
				def.resolve();
			}).
				error((data, status, headers, config) => {
					console.error(`Cannot finalize game. Status code: ${status}.`);
					def.reject(data);
				});

			return def.promise;
		};

		public DeleteGame(gameIdPath: string): ng.IPromise<any> {
			var def = this.$q.defer();

			this.$http.delete(`/games${gameIdPath}`)
				.success((data, status, headers, config) => {
					def.resolve();
				})
				.error((data, status, headers, config) => {
					console.error(`Cannot delete game with id ${gameIdPath}`)
					def.reject(data);
				});

			return def.promise;
		};
	}
}
