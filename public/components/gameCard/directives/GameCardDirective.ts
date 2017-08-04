module Components {
	export function GameCardDirective(): ng.IDirective {
		return {
			scope: {
				game: "=",
				showModifyButtons: "=",
				reload: "&"
			},
			templateUrl: '/components/gameCard/directives/GameCardTemplate.html',
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
		Edit,
		Error
	}

	export class GameCardController {
		public static $inject: string[] = ['gameCardService', 'apiService'];

		public game: Shared.IGame;
		public showModifyButtons: boolean;
		public reload: Function;

		private showOverlay: boolean = false;
		private showLoadBar: boolean = false;
		private showDeleteWarning: boolean = false;
		private showDeleted: boolean = false;
		private showError: boolean = false;				
		private errorMessage: string;
		
		constructor(private gameCardService: IGameCardService, private apiService: Shared.IApiService) {
			this.changeState(State.Ready);
		}

		private changeState(newState: State): void {
			this.showOverlay = newState !== State.Ready;
			this.showLoadBar = newState === State.Deleting || newState === State.Copy || newState === State.Edit;
			this.showDeleteWarning = newState === State.DeleteWarning;
			this.showError = newState === State.Error;
			this.showDeleted = newState === State.Deleted;

			switch (newState) {
				case State.Ready:
					break;
				case State.Copy:
					this.copy();
					break;
				case State.Edit:
					this.gameCardService.edit(this.game);
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
			this.gameCardService.delete(this.game).then(()=>{
				this.changeState(State.Deleted);
			}, (data) => {
				this.errorHandler(data, 'Error deleting game!');
			});
		}
	
		// Dont call directly. Change state to "Copy" instead.
		private copy(): void {
			this.gameCardService.copy(this.game).then(()=>{}, (data)=>{
				this.errorHandler(data, 'Error copying game!');
			});
		}

		private edit(): void {
			this.changeState(State.Edit);
		}

		private warnDelete(): void {
			this.changeState(State.DeleteWarning);
		}

		private dismissOverlay(): void {
			this.changeState(State.Ready);
		}

		private deleteGame(game: Shared.IGameViewModel): void {
			this.changeState(State.Deleting);
		}

		private copyGame(game: Shared.IGameViewModel): void {
			this.changeState(State.Copy);
		}
	}
}