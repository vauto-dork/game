module EditGame {
    import EditGameType = Shared.EditGameType;
    
    export function EditGameDirective(): ng.IDirective {
        return {
            scope: {
                isFinalizedGame: '='
            },
            templateUrl: "/areas/editGame/directives/EditGameTemplate.html",
            controller: "EditGameController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }

    export class EditGameController {
        public static $inject: string[] = ["$window", "editGameStateService", "editGameService", "alertsService", "editGameCollapseService"];

        public isFinalizedGame: boolean;

        private datePlayed: Date;
        private gameType: EditGameType;

        private get showLoading(): boolean {
            return this.stateService.showLoading;
        }

        private get showError(): boolean {
            return this.stateService.showError;
        }

        private get showScoreForm(): boolean {
            return this.stateService.showScoreForm;
        }

        private get disabled(): boolean {
            return this.stateService.disabled;
        }

        private get alerts(): Shared.IAlert[] {
            return this.alertsService.alerts;
        }

        private get collapseScoreForm(): boolean {
            return this.editGameCollapseService.collapseScoreForm;
        }

        private get collapseModifyPlayers(): boolean {
            return this.editGameCollapseService.collapseModifyPlayers;
        }

        constructor(private $window: ng.IWindowService,
            private stateService: IEditGameStateService,
            private editGameService: IEditGameService,
            private alertsService: Shared.IAlertsService,
            private editGameCollapseService: IEditGameCollapseService)
            {
                this.gameType = this.isFinalizedGame ? EditGameType.FinalizedGame : EditGameType.ActiveGame;

                this.stateService.subscribeStateChange((event, newState) => {
                    switch (newState) {
                        case State.Loading:
                            this.getGame();
                            break;
                        case State.Error:
                            this.alertsService.scrollToTop();
                            break;
                        case State.Ready:
                            this.ready();
                            break;
                        case State.Saving:
                            this.saveGame();
                            break;
                        case State.Finalizing:
                            this.finalizeGame();
                            break;
                        case State.Updating:
                            this.updateFinalizedGame();
                            break;
                    }
                });

                this.stateService.changeState(State.Loading);
        }

        private ready(): void {
            if (this.collapseScoreForm) {
                this.editGameCollapseService.enableScoreForm();
            }
            this.alertsService.scrollToTop();
        }

        private errorHandler(data: string, errorMessage: string) {
            this.alertsService.addAlert("danger", errorMessage);
            console.error(data);
            this.stateService.changeState(State.Error);
        }

        private getGame(): void {
            this.alertsService.clearAlerts();
            this.editGameService.getGame(this.gameType).then(() => {
                this.stateService.changeState(State.Ready);
                this.datePlayed = this.editGameService.datePlayed;
            }, () => {
                this.errorHandler("Cannot get active game.", "Cannot load game");
            });
        }

        public saveGame(): void {
            this.alertsService.clearAlerts();
            this.editGameService.datePlayed = this.datePlayed;

            this.editGameService.save().then(() => {
                this.alertsService.addAlert("success", "Game saved successfully!");
                this.stateService.changeState(State.Ready);
            }, () => {
                this.saveReject();
            });
        }

        public finalizeGame(): void {
            this.editGameService.finalize().then(() => {
                this.$window.location.href = "/GameHistory";
            }, () => {
                this.saveReject();
            });
        }

        public updateFinalizedGame(): void {
            this.editGameService.datePlayed = this.datePlayed;
            this.editGameService.updateFinalizedGame().then(() => {
                this.$window.location.href = "/GameHistory/Admin";
            }, () => {
                this.saveReject();
            });
        }

        private saveReject(): void {
            // get error messages and display alerts
            this.alertsService.clearAlerts();
            this.editGameService.errorMessages.forEach(msg => { this.alertsService.addAlert("danger", msg); });
            this.stateService.changeState(State.Ready);
        }
        
        // UI Hookups

        private closeAlert(index: number): void {
            this.alertsService.closeAlert(index);
        }

        private enableScoreForm(): void {
            this.editGameCollapseService.enableScoreForm();
        }

        private disableScoreForm(): void {
            this.editGameCollapseService.disableScoreForm();
        }

        private enableModifyPlayers(): void {
            this.editGameCollapseService.enableModifyPlayers();
        }
    }
}