module Players {
    export function PlayersListDirective(): ng.IDirective {
        return {
			scope: {
			},
			templateUrl: "/areas/players/directives/PlayersListTemplate.html",
			controller: "PlayersListController",
			controllerAs: "ctrl",
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
        public static $inject: string[] = ["apiService", "alertsService", "playersListService"];

		private disableControls: boolean = false;
		private showError: boolean = false;
		private showLoading: boolean = false;
		private showPlayers: boolean = false;
		private showPlayerEdit: boolean = false;

        private get alerts(): Shared.IAlert[] {
            return this.alertsService.alerts;
        }

		private get players(): Shared.IPlayer[] {
			return this.playersListService.players;
		}

		private selectedPlayer: Shared.IPlayer;
		private filter: string = "";

        constructor(private apiService: Shared.ApiService,
			private alertsService: Shared.IAlertsService,
			private playersListService: IPlayersListService){
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
					this.alertsService.clearAlerts();
					break;
				case State.SavingPlayer:
					this.savePlayer(this.selectedPlayer, ()=>{
						this.changeState(State.Saved);
					});
					break;
				case State.Saved:
					this.alertsService.addAlert("success", "Player saved successfully!");
					this.changeState(State.Loading);
					break;
			}
		}

		private errorHandler(data: string, errorMessage: string): void {
			this.alertsService.addAlert("danger", errorMessage);
			console.error(data);
			this.changeState(State.Error);
		}
        
		private loadPlayers(): void {
			this.playersListService.loadPlayers().then(()=>{
				this.changeState(State.Ready);
			}, (data: string)=>{
				this.errorHandler(data, "Error fetching players!");
			});
		}

		private toggleInactive(player: Shared.IPlayer): void {
			player.inactive = !player.inactive;
			this.savePlayer(player, null);
		}

		private savePlayer(player: Shared.IPlayer, callback: Function): void {
			this.playersListService.savePlayer(player).then(()=>{
				if (callback) {
					callback();
				}
			}, (data: string)=>{
				this.errorHandler(data, "Player save failure!");
			});
		}

		private removeFilter(): void {
			this.filter = "";
		}
        
		private editPlayer(player: Shared.IPlayer): void {
			this.selectedPlayer = angular.copy(player);
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
			this.alertsService.clearAlerts();
			this.changeState(State.Loading);
        }

        private closeAlert(index: number): void {
            this.alertsService.closeAlert(index);
        }
    }
}
