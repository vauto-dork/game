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

        // These need to be moved to a service.
        private game: Shared.IGame;
        private allPlayers: Shared.INewGamePlayer[];

        private showLoading: boolean = false;
        private showError: boolean = false;
        private showScoreForm: boolean = false;
        private disableControls: boolean = false;
        private showAddPlayer: boolean = false;
        private showReorderPlayers: boolean = false;
        //private datePlayedJs: Date = new Date();
        
        private get datePlayed(): Date {
            return this.editActiveGameService.datePlayed;
        }
        
        private set datePlayed(value: Date) {
            this.editActiveGameService.datePlayed = value;
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
            //$scope.addAlert('danger', errorMessage);
            console.error(data);
            this.changeState(State.Error);
        };
        
        // private getFormattedDate(){
        //     return this.datePlayedJs.toISOString();
        // }
	
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
            }, () => {
                this.errorHandler('Cannot get active game.', 'Cannot load game');
            });
            // var promise = editActiveGameFactory.GetActiveGame();
            // promise.then(function() {
            //     me.game = editActiveGameFactory.Game();
            //     me.allPlayers = editActiveGameFactory.AllPlayers();
            //     me.resetSelectedToMove();
            //     me.datePlayedJs = Date.parse(me.game.datePlayed);
            //     me.changeState(me.State.Ready);
            // }, function(data) {
            //     me.errorHandler(data, 'Cannot load game.');
            // });
        }

        public saveGame(): void {
            //$scope.clearAlerts();
            
            this.editActiveGameService.save().then(() => {
                //$scope.addAlert('success', 'Game saved successfully!');
                this.changeState(State.Ready);
            }, () => {
                // get error messages and display alerts
                this.changeState(State.Ready);
            });
        }
	
        public finalizeGame(): void {
            this.editActiveGameService.finalize().then(() => {
                this.$window.location.href = '/GameHistory';
            }, () => {
                // get error messages and display alerts
                this.changeState(State.Ready);
            });
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
	
        private disableSave(): boolean {
            return this.showReorderPlayers || this.showAddPlayer;
        }

        private toggleReorderPlayers() {
            this.showReorderPlayers = !this.showReorderPlayers;
        }
    }
}