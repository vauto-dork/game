module Shared {
	export function GameCardDirective(): ng.IDirective {
		return {
			scope: {
				game: "=",
				showModifyButtons: "=",
				reload: "&"
			},
			templateUrl: '/shared/directives/GameCardTemplate.html',
			controller: 'GameCardController',
			controllerAs: 'ctrl',
			bindToController: true
		};
	}

	enum State {
		Ready,
		DeleteWarning,
		Deleting,
		Deleted,
		Copy,
		Error
	}

	export class GameCardController {
		public static $inject: string[] = ['$http', '$window', 'apiService'];

		private showOverlay: boolean = false;
		private showLoadBar: boolean = false;
		private showDeleteWarning: boolean = false;
		private showDeleted: boolean = false;
		private showError: boolean = false;
		
		private game: IGame;
		private errorMessage: string;
		
		constructor(private $http: ng.IHttpService, private $window: ng.IWindowService, private apiService: IApiService) {
			this.changeState(State.Ready);
		}

		private changeState(newState: State): void {
			this.showOverlay = newState !== State.Ready;
			this.showLoadBar = newState === State.Deleting || newState === State.Copy;
			this.showDeleteWarning = newState === State.DeleteWarning;
			this.showError = newState === State.Error;
			this.showDeleted = newState === State.Deleted;

			switch (newState) {
				case State.Ready:
					break;
				case State.Copy:
					this.copy();
					break;
				case State.Deleting:
					this.delete();
					break;
			}
		}

		private errorHandler(data: string, errorMessage: string): void {
			this.errorMessage = errorMessage;
			console.error(data);
			this.changeState(State.Error);
		}
	
		// Dont call directly. Change state to "Deleting" instead.
		private delete(): void {
			this.apiService.deleteActiveGame(this.game.getIdAsPath()).then(() => {
				this.changeState(State.Deleted);
			}, (data) => {
				this.errorHandler(data, 'Error deleting game!');
			});
		}
	
		// Dont call directly. Change state to "Copy" instead.
		private copy(): void {
			var newGame: IGame = new Game();
			
			newGame.players = this.game.players.map((player) => {
				var gamePlayer = new GamePlayer();
				gamePlayer.player = player.player;
				return gamePlayer;
			});
			
			this.apiService.createActiveGame(newGame).then(editUrl => {
				this.$window.location.href = editUrl;
			}, (data) => {
				this.errorHandler(data, 'Error copying game!');
			});
		}

		private warnDelete(): void {
			this.changeState(State.DeleteWarning);
		}

		private dismissOverlay(): void {
			this.changeState(State.Ready);
		}

		private deleteGame(game: IGameViewModel): void {
			this.changeState(State.Deleting);
		}

		private copyGame(game: IGameViewModel): void {
			this.changeState(State.Copy);
		}
	}
}