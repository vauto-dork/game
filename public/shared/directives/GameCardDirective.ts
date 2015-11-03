module Shared {
	export function GameCardDirective(): ng.IDirective {
		return {
			scope: {
				game: "=",
				gamePath: "=",
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
		public static $inject: string[] = ['$scope', '$http', '$window', 'apiService'];

		private showOverlay: boolean = false;
		private showLoadBar: boolean = false;
		private showDeleteWarning: boolean = false;
		private showDeleted: boolean = false;
		private showError: boolean = false;
		
		private selectedGame: IGameViewModel;
		private errorMessage: string;
		private gamePath: string;
		
		constructor(private $scope: ng.IScope, private $http: ng.IHttpService, private $window: ng.IWindowService, private apiService: IApiService) {
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
					this.selectedGame = null;
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
			if (!this.selectedGame) {
				this.errorHandler(null, 'No game selected!');
				return;
			}

			this.$http.delete(this.gamePath + '/' + this.selectedGame._id)
				.success((data, status, headers, config) => {
					this.changeState(State.Deleted);
				})
				.error((data, status, headers, config) => {
					this.errorHandler(data, 'Error deleting game!');
				});
		}
	
		// Dont call directly. Change state to "Copy" instead.
		private copy(): void {
			if (!this.selectedGame) {
				this.errorHandler(null, 'No game selected!');
				return;
			}
			
			// var playersList: IGamePlayerViewModel[] = this.selectedGame.players.map((value: IGamePlayerViewModel) => {
			// 	var player: IGamePlayerViewModel = {
			// 		_id: value._id,
			// 		player: value.player
			// 	}
			// 	
			// 	return player;
			// });
			// 
			// var createGamePromise = this.apiService.CreateActiveGame({players: playersList});
			// createGamePromise.then((data: IGameViewModel) => {
			// 	this.$window.location.href = '/activeGames/edit/#/' + data._id;
			// }, (data: string) => {
			// 	this.errorHandler(data, 'Error copying game!');
			// });

			var removedScores: IGamePlayerViewModel[] = angular.copy(this.selectedGame.players)

			removedScores.forEach((element: IGamePlayerViewModel) => {
				element.points = 0;
				element.rank = 0;
			});
			
			this.$http.post('/activeGames/save', { players: removedScores })
				.success((data: IGameViewModel, status, headers, config) => {
					this.$window.location.href = '/activeGames/edit/#/' + data._id;
				})
				.error((data, status, headers, config) => {
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
			this.selectedGame = game;
			this.changeState(State.Deleting);
		}

		private copyGame(game: IGameViewModel): void {
			this.selectedGame = game;
			this.changeState(State.Copy);
		}
	}
}