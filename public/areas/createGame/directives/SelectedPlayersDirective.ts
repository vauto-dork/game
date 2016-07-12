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
        public static $inject: string[] = ['createGameService'];
        
        private get players(): Shared.INewGamePlayer[] {
            return this.createGameService.playersSorted;
        }

        private get hasMinimumPlayers(): boolean {
            return this.createGameService.hasMinimumPlayers;
        }

        constructor(private createGameService: ICreateGameService) {
        }
        
        private removePlayer(player: Shared.INewGamePlayer) {
            this.createGameService.removePlayer(player);
        }
    }
}
