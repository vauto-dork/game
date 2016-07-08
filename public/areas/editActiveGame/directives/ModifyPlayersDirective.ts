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
        private allPlayers: Shared.INewGamePlayer[];
        private curatedPlayersList: Shared.INewGamePlayer[];
        
        private get currentPlayers(): Shared.IGamePlayer[] {
            return this.editActiveGameService.players;
        }

        private set currentPlayers(value: Shared.IGamePlayer[]) {
            this.editActiveGameService.players = value;
        }

        constructor(private $scope: ng.IScope,
            private editActiveGameService: IEditActiveGameService) {
            this.editActiveGameService.getAllPlayers()
                .then((data) => {
                    this.allPlayers = data;
                    this.curateNewPlayerList();
                });
        }

        private curateNewPlayerList(): void {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.currentPlayers.map(p => p.playerId);

            // Get players that are not in the current playlist.
            this.curatedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        }

        private onSelected(data: Shared.INewGamePlayer): void {
            var player = new Shared.GamePlayer(data.toGamePlayerViewModel());
            this.currentPlayers.push(player);
            this.curateNewPlayerList();
        }

        private back(): void {
            this.editActiveGameService.toggleModifyPlayers();
        }
    }
}