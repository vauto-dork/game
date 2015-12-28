module CreateGame {
    export function SelectedPlayersDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: '/areas/createGame/directives/SelectedPlayersTemplate.html',
            controller: 'SelectedPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class SelectedPlayersController {
        public static $inject: string[] = ['$scope', 'createGameService'];
        
        private get orderModel(): string {
            if(this.createGameService.playerSort === NewGameSort.Rating) {
                return 'Rating';
            } else {
                return 'Selected';
            }
        }
        
        private set orderModel(value: string) {
            // do nothing
        }
        
        private get selectedPlayers(): Shared.INewGamePlayer[] {
            return this.createGameService.getSelectedPlayers();
        }
        
        private set selectedPlayers(value: Shared.INewGamePlayer[]) {
            //do nothing.
        }

        constructor(private $scope: ng.IScope, private createGameService: ICreateGameService) {
        }
        
        private removePlayer(player: Shared.INewGamePlayer) {
            this.createGameService.deselectPlayer(player);
        }
        
        private useThisOrder(): void {
			this.createGameService.playerSort = NewGameSort.Selected;
		};
        
        private useGameOrder(): void {
			this.createGameService.playerSort = NewGameSort.Rating;
		};
    }
}
