module Players {
    export function PlayersListDirective(): ng.IDirective {
        return {
			scope: {
			},
			templateUrl: '/areas/players/directives/PlayersListTemplate.html',
			controller: 'PlayersListController',
			controllerAs: 'ctrl',
			bindToController: true
        };
    }

	enum State {
		Loading,
		Ready,
		Error,
		EditPlayer,
		SavingPlayer,
		Saved
	}

    export class PlayersListController {
        public static $inject: string[] = ['$scope', '$window', 'apiService'];

		private disableControls: boolean = false;
		private showError: boolean = false;
		private showLoading: boolean = false;
		private showPlayers: boolean = false;
		private showPlayerEdit: boolean = false;

		private alerts = [];

		private players: Shared.IPlayer[] = [];
		private selectedPlayer: Shared.IPlayer;
		private filter: string = '';

        constructor(private $scope: ng.IScope, private $window: ng.IWindowService, private apiService: Shared.ApiService) {
			this.changeState(State.Loading);
        }

		private changeState(newState: State): void {
			this.showLoading = newState === State.Loading;
			this.showPlayers = newState === State.Ready;
			this.showPlayerEdit = newState === State.EditPlayer || newState === State.SavingPlayer;
			this.disableControls = newState === State.SavingPlayer;
			this.showError = newState === State.Error;

			switch (newState) {
				case State.Loading:
					this.loadPlayers();
					break;
				case State.EditPlayer:
					this.clearAlerts();
					break;
				case State.SavingPlayer:
					this.savePlayer();
					break;
				case State.Saved:
					this.addAlert('success', 'Player saved successfully!');
					this.changeState(State.Loading);
					break;
			}
		}

		private errorHandler(data: string, errorMessage: string): void {
			this.addAlert('danger', errorMessage);
			console.error(data);
			this.changeState(State.Error);
		}

		private closeAlert(index: number): void {
			this.alerts.splice(index, 1);
		}

		private addAlert(messageType: string, message: string): void {
			this.alerts.push({ type: messageType, msg: message });
		}

		private clearAlerts(): void {
			this.alerts = [];
		}

		private loadPlayers(): void {
			this.apiService.getAllPlayers().then((data: Shared.IPlayer[]) => {
				this.players = data;
				this.changeState(State.Ready);
			}, (data) => {
				this.errorHandler(data, 'Error fetching players!');
			});
		}

		private savePlayer(): void {
			this.apiService.saveExistingPlayer(this.selectedPlayer).then(() => {
				this.changeState(State.Saved);
			}, (data: string) => {
				this.errorHandler(data, 'Player save failure!');
			});
		}

		private removeFilter(): void {
			this.filter = '';
		}

		private scrollToTop(): void {
			this.$window.scrollTo(0, 0);
		}

		private editPlayer(player: Shared.IPlayer): void {
			this.selectedPlayer = player;
			this.changeState(State.EditPlayer);
		}

		private cancelEdit(): void {
			this.selectedPlayer = undefined;
			this.changeState(State.Ready);
		}

		private save(): void {
			this.changeState(State.SavingPlayer);
		}

		private reload() {
			this.clearAlerts();
			this.changeState(State.Loading);
		}
    }
}
