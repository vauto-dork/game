module Components {
    import EditGameType = Shared.EditGameType;

    export interface IGameCardService {
        gameType: EditGameType;

        copy(game: Shared.IGame): ng.IPromise<string>;
        edit(game: Shared.IGame): void;
        delete(game: Shared.IGame): ng.IPromise<void>;
    }

    export class GameCardService implements IGameCardService {
        public static $inject: string[] = ['$window', 'apiService'];

        public gameType: EditGameType;

        constructor(private $window: ng.IWindowService, private apiService: Shared.IApiService) {
            this.gameType = EditGameType.ActiveGame;
        }

		public copy(game: Shared.IGame): ng.IPromise<string> {
			var newGame: Shared.IGame = new Shared.Game();
			
			newGame.players = game.players.map((player) => {
				var gamePlayer = new Shared.GamePlayer();
				gamePlayer.player = player.player;
				return gamePlayer;
			});
			
			var promise = this.apiService.createActiveGame(newGame);

            promise.then(editUrl => {
				this.$window.location.href = editUrl;
			});

            return promise;
		}

        public edit(game: Shared.IGame): void {
            var parentPath = this.gameType === EditGameType.ActiveGame
                ? "/ActiveGames/Edit/#"
                : "/GameHistory/Edit/#";

            this.$window.location.href = parentPath + game.getIdAsPath();
        }

		public delete(game: Shared.IGame): ng.IPromise<void> {
            return this.gameType === EditGameType.ActiveGame
                ? this.apiService.deleteActiveGame(game.getIdAsPath())
                : this.apiService.deleteGame(game.getIdAsPath());
		}
    }
}