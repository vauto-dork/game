module CreateGame {
    export function CreateGameDirective(): ng.IDirective {
        return {
			scope: {
			},
			templateUrl: '/areas/createGame/directives/CreateGameTemplate.html',
			controller: 'CreateGameController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

	enum State {
		Loading,
		Error,
		Loaded,
		CreatingGame
	}

    export class CreateGameController {
        public static $inject: string[] = ['$scope', '$window', 'createGameService'];

		private showLoading: boolean = false;
		private showErrorMessage: boolean = false;
		private showPlayers: boolean = false;
		
		private selectedPlayers: Shared.INewGamePlayer[] = [];
		private unselectedPlayers: Shared.INewGamePlayer[] = [];
		
		private orderedPlayersLoaded: boolean = false;
		private disableOrderedPlayers: boolean = false;
		
		private get firstGameOfMonth(): boolean {
			return this.createGameService.isFirstGameOfMonth();
		}
		
        constructor(private $scope: ng.IScope, private $window: ng.IWindowService, private createGameService: ICreateGameService) {
			this.createGameService.init().then(() => {
				this.updatePlayers();
				this.changeState(State.Loaded);
			});
			
			$scope.$watch(() => this.createGameService.numberSelectedPlayers(), () => {
				this.updatePlayers();
			});
        }

		private changeState(newState: State): void {
			this.showLoading = (newState === State.Loading) || (newState === State.CreatingGame);
			this.showPlayers = (newState === State.Loaded);
			this.showErrorMessage = newState === State.Error;

			switch (newState) {
				case State.CreatingGame:
					this.createNewActiveGame();
					break;
			}
		}
		
		private getPlayersInGameOrder(): void {
			this.createGameService.playerSort = NewGameSort.Rating;
		}
		
		private onSelected(data: Shared.INewGamePlayer): void {
			this.createGameService.selectPlayer(data);
		};
		
		private get hasSelectedPlayers(): boolean {
			return this.createGameService.numberSelectedPlayers() > 0;
		};
		
		private get disableGameCreation(): boolean {
			return this.createGameService.numberSelectedPlayers() < 3;
		}
		
		// Cannot use setter/getter with the player selector
		private updatePlayers(): void {
			this.selectedPlayers = this.createGameService.getSelectedPlayers();
			this.unselectedPlayers = this.createGameService.getUnselectedPlayers();
		}
		
		private removeAll(): void {
			this.createGameService.reset();
		};

		private startGame(): void {
			this.changeState(State.CreatingGame);
		};

		private createNewActiveGame() {
			this.createGameService.createNewActiveGame().then(data => {
				this.$window.location.href = '/activeGames/edit/#/' + data._id;
			}, () => {
				this.changeState(State.Error);
			});
		};
    }
}
