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
        
        private get selectedPlayers(): Shared.INewGamePlayer[] {
            return this.createGameService.getSelectedPlayers();
        }

        private get hasMinimumPlayers(): boolean {
            return this.selectedPlayers.length >= 3;
        }

        constructor(private $scope: ng.IScope, private createGameService: ICreateGameService) {
        }
        
        private removePlayer(player: Shared.INewGamePlayer) {
            this.createGameService.deselectPlayer(player);
        }
    }
}
