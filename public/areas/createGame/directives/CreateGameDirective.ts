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
        public static $inject: string[] = ['$window', 'createGameService'];

		private showLoading: boolean = false;
		private showErrorMessage: boolean = false;
		private showForm: boolean = false;
		
		private orderedPlayersLoaded: boolean = false;
		private disableOrderedPlayers: boolean = false;

		private datePlayed: Date = null;
		
        private get sortOrder(): string {
            return NewGameSort[this.createGameService.sortOrder];
        }

        private set sortOrder(value: string) {
            // do nothing, but required to have a setter
        }
        
		private get unselectedPlayers(): Shared.INewGamePlayer[] {
			return this.createGameService.unselectedPlayers;
		}
        
        constructor(private $window: ng.IWindowService, private createGameService: ICreateGameService) {
            this.createGameService.init().then(() => {
                this.changeState(State.Loaded);
            });
        }

		private changeState(newState: State): void {
			this.showLoading = (newState === State.Loading) || (newState === State.CreatingGame);
			this.showForm = (newState === State.Loaded);
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
        
		private useThisOrder(): void {
			this.createGameService.sortOrder = NewGameSort.Selected;
		}
        
        private useGameOrder(): void {
			this.createGameService.sortOrder = NewGameSort.Rating;
		}
    }
}
