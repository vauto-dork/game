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
        public static $inject: string[] = ['$scope', '$timeout', '$window', 'editActiveGameService'];
        
        private showLoading: boolean = false;
        private showError: boolean = false;
        private showScoreForm: boolean = false;
        private disableControls: boolean = false;
        private showAddPlayer: boolean = false;
        private datePlayed: Date;

        private alerts = [];
        
        private get showModifyPlayers(): boolean {
            return this.editActiveGameService.showModifyPlayers;
        }

        constructor(private $scope: ng.IScope,
                    private $timeout: ng.ITimeoutService,
                    private $window: ng.IWindowService,
                    private editActiveGameService: IEditActiveGameService) {
            this.changeState(State.Init);
        }

        private changeState(newState: State): void {

            this.showLoading = (newState === State.Init) ||
                (newState === State.Loading);

            this.showError = newState === State.Error;

            this.showScoreForm = (newState !== State.Init) &&
                (newState !== State.Loading) &&
                (newState !== State.Error);

            this.disableControls = (newState === State.Saving) ||
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
                    this.scrollToTop();
                    break;
                case State.Ready:
                    if (this.showModifyPlayers) {
                        this.editActiveGameService.toggleModifyPlayers();
                    }
                    this.scrollToTop();
                    break;
                case State.Saving:
                    this.saveGame();
                    break;
                case State.Finalizing:
                    this.finalizeGame();
                    break;
            }
        }
        
        private errorHandler(data: string, errorMessage: string) {
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
        
        private returnToActiveGames(): void{
            this.$window.location.href = '/ActiveGames';
        }
        
        private scrollToTop(): void {
            this.$timeout(() => {
                this.$window.scrollTo(0, 0);
            });
        }
        
        private scrollToBottom(): void {
            this.$timeout(() => {
                this.$window.scrollTo(0, 100000);
            });
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
            this.clearAlerts();
            this.editActiveGameService.datePlayed = this.datePlayed;

            this.editActiveGameService.save().then(() => {
                this.addAlert('success', 'Game saved successfully!');
                this.changeState(State.Ready);
            }, () => {
                this.saveReject();
            });
        }
	
        public finalizeGame(): void {
            this.editActiveGameService.finalize().then(() => {
                this.$window.location.href = '/GameHistory';
            }, () => {
                this.saveReject();
            });
        }

        private saveReject(): void {
            // get error messages and display alerts
            this.clearAlerts();
            this.editActiveGameService.getErrorMessages().forEach(msg => { this.addAlert('danger', msg); });
            this.changeState(State.Ready);
        }
     
        // UI Hookups
        
        private save(): void {
            this.changeState(State.Saving);	
        }
	
        private finalize(): void {
            this.changeState(State.Finalizing);
        }
	
        private revert(): void {
            this.changeState(State.Loading);
        }

        private toggleModifyPlayers(): void {
            this.editActiveGameService.toggleModifyPlayers();
        }
    }
}