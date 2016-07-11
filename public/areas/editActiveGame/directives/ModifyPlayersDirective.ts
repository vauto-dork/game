module EditActiveGame {
    export function ModifyPlayersDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: '/areas/editActiveGame/directives/ModifyPlayersTemplate.html',
            controller: 'ModifyPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class ModifyPlayersController {
        public static $inject: string[] = ['$scope', 'editActiveGameService'];
        
        private get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.editActiveGameService.unselectedPlayers;
        }
        
        constructor(private $scope: ng.IScope,
            private editActiveGameService: IEditActiveGameService) {
        }

        private onSelected(data: Shared.INewGamePlayer): void {
            var player = new Shared.GamePlayer(data.toGamePlayerViewModel());
            this.editActiveGameService.addPlayer(player);
        }

        private back(): void {
            this.editActiveGameService.toggleModifyPlaylist();
        }
    }
}