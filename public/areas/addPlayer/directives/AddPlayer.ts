module AddPlayer {
    export function AddPlayer(): ng.IComponentOptions {
        return {
			templateUrl: '/areas/addPlayer/directives/AddPlayerTemplate.html',
			controller: AddPlayerController
		};
    }

	enum State {
		Ready,
		Saving,
		Saved,
		Fail
	};

    export class AddPlayerController {
        public static $inject: string[] = ['$timeout', 'apiService'];

		private addPlayerForm: ng.IFormController;
		private player: Shared.IPlayer;
		private success: boolean = false;
		private failure: boolean = false;
		private disableControls: boolean = false;

        constructor(private $timeout: ng.ITimeoutService, private apiService: Shared.IApiService) {
			this.player = new Shared.Player();
			this.changeState(State.Ready);
        }

		private changeState(newState: State): void {
			this.success = newState === State.Saved;
			this.failure = newState === State.Fail;
			this.disableControls = newState === State.Saving;

			switch (newState) {
				case State.Ready:
					this.resetForm();
					break;
				case State.Saving:
					this.savePlayer();
					break;
				case State.Saved:
					this.resetForm();
					this.$timeout(() => {
						this.changeState(State.Ready);
					}, 5000);
					break;
			}
		}

		private savePlayer(): void {
			this.apiService.saveNewPlayer(this.player).then(() => {
				this.changeState(State.Saved);
			}, (data: string) => {
				this.changeState(State.Fail);
			});
		}

		private resetForm(): void {
			this.player = new Shared.Player();

			if (this.addPlayerForm) {
				this.addPlayerForm.$setPristine();
				this.addPlayerForm.$setUntouched();
			}
		}

		private reset(): void {
			this.changeState(State.Ready);
		}

		private submit(): void {
			this.addPlayerForm.$setSubmitted();

			if (!this.addPlayerForm.$invalid) {
				this.changeState(State.Saving);
			}
		}

    }
}
