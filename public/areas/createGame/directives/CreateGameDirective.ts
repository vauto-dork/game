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
		
		private orderedPlayersLoaded: boolean = false;
		private disableOrderedPlayers: boolean = false;

		private datePlayed: Date = null;
		
        private get sortOrder(): string {
            if(this.createGameService.sortOrder === NewGameSort.Rating) {
                return 'Rating';
            } else {
                return 'Selected';
            }
        }
        
		private get hasDate(): boolean {
			return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
		}

		private get curatedNewPlayers(): Shared.INewGamePlayer[] {
			return this.createGameService.curatedNewPlayers;
		}

		private get hasSelectedPlayers(): boolean {
			return this.createGameService.numPlayers > 0;
		}
		
		private get disableGameCreation(): boolean {
			return !this.hasDate || !this.createGameService.hasMinimumPlayers;
		}
        		
        constructor(private $scope: ng.IScope, private $window: ng.IWindowService, private createGameService: ICreateGameService) {
			this.createGameService.init().then(() => {
				this.changeState(State.Loaded);
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
		
		private addPlayer(data: Shared.INewGamePlayer): void {
			this.createGameService.addPlayer(data);
		}
		
		private reset(): void {
			this.datePlayed = null;
			this.createGameService.reset();
		}

		private createGame(): void {
			this.changeState(State.CreatingGame);
		}

		private createNewActiveGame() {
			this.createGameService.createNewActiveGame(this.datePlayed).then(editUrl => {
				this.$window.location.href = editUrl;
			}, () => {
				this.changeState(State.Error);
			});
		}

		private useCurrentDateTime(): void {
			this.datePlayed = new Date();
		}

		private useThisOrder(): void {
			this.createGameService.sortOrder = NewGameSort.Selected;
		}
        
        private useGameOrder(): void {
			this.createGameService.sortOrder = NewGameSort.Rating;
		}
    }
}
