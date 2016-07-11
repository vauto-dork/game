module EditActiveGame {
    export function EditActiveGameDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: '/areas/editActiveGame/directives/EditActiveGameTemplate.html',
            controller: 'EditActiveGameController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    enum State {
        Init,
        Loading,
        Error,
        Ready,
        Saving,
        Finalizing
    };

    export class EditActiveGameController {
        public static $inject: string[] = ['$window', 'editActiveGameService', 'alertsService'];

        private showLoading: boolean = false;
        private showError: boolean = false;
        private showScoreForm: boolean = false;
        private disabled: boolean = false;
        private datePlayed: Date;

        private get alerts(): Shared.IAlert[] {
            return this.alertsService.alerts;
        }

        private get showModifyPlaylist(): boolean {
            return this.editActiveGameService.showModifyPlaylist;
        }

        constructor(private $window: ng.IWindowService,
            private editActiveGameService: IEditActiveGameService,
            private alertsService: Shared.IAlertsService) {
            this.changeState(State.Init);
        }

        private changeState(newState: State): void {

            this.showLoading = (newState === State.Init) ||
                (newState === State.Loading);

            this.showError = newState === State.Error;

            this.showScoreForm = (newState !== State.Init) &&
                (newState !== State.Loading) &&
                (newState !== State.Error);

            this.disabled = (newState === State.Saving) ||
                (newState === State.Finalizing) ||
                (newState === State.Init) ||
                (newState === State.Loading);

            switch (newState) {
                case State.Init:
                    this.changeState(State.Loading);
                    break;
                case State.Loading:
                    this.getActiveGame();
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
            }
        }

        private ready(): void {
            if (this.showModifyPlaylist) {
                this.toggleModifyPlaylist();
            }
            this.alertsService.scrollToTop();
        }

        private errorHandler(data: string, errorMessage: string) {
            this.alertsService.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
        }

        private getActiveGame(): void {
            this.editActiveGameService.getActiveGame().then(() => {
                this.changeState(State.Ready);
                this.datePlayed = this.editActiveGameService.datePlayed;
            }, () => {
                this.errorHandler('Cannot get active game.', 'Cannot load game');
            });
        }

        public saveGame(): void {
            this.alertsService.clearAlerts();
            this.editActiveGameService.datePlayed = this.datePlayed;

            this.editActiveGameService.save().then(() => {
                this.alertsService.addAlert('success', 'Game saved successfully!');
                this.changeState(State.Ready);
            }, () => {
                this.saveReject();
            });
        }

        public finalizeGame(): void {
            this.editActiveGameService.finalize(true).then(() => {
                this.$window.location.href = '/GameHistory';
            }, () => {
                this.saveReject();
            });
        }

        private saveReject(): void {
            // get error messages and display alerts
            this.alertsService.clearAlerts();
            this.editActiveGameService.errorMessages.forEach(msg => { this.alertsService.addAlert('danger', msg); });
            this.changeState(State.Ready);
        }
        
        // UI Hookups

        private closeAlert(index: number): void {
            this.alertsService.closeAlert(index);
        }

        private save(): void {
            this.changeState(State.Saving);
        }

        private finalize(): void {
            this.changeState(State.Finalizing);
        }

        private revert(): void {
            this.changeState(State.Loading);
        }

        private toggleModifyPlaylist(): void {
            this.editActiveGameService.toggleModifyPlaylist();
        }
    }
}