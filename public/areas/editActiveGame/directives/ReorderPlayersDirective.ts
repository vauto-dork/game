module EditActiveGame {
    export function ReorderPlayersDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: '/areas/editActiveGame/directives/ReorderPlayersTemplate.html',
            controller: 'ReorderPlayersController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class ReorderPlayersController {
        public static $inject: string[] = ['$scope', 'editActiveGameService'];
        
        private selectedPlayerId: string;

        private get dropZoneActive(): boolean {
            return this.editActiveGameService.movePlayerActive;
        }

        private set dropZoneActive(value: boolean) {
            this.editActiveGameService.movePlayerActive = value;
        }

        private get players(): Shared.IGamePlayer[] {
            return this.editActiveGameService.players;
        }

        private set players(value: Shared.IGamePlayer[]) {
            this.editActiveGameService.players = value;
        }

        constructor(private $scope: ng.IScope, private editActiveGameService: IEditActiveGameService) {
            this.unselect();
        }
        
        private clickHandler(player): void {
            if (!this.dropZoneActive && !this.selectedPlayerId) {
                this.markToMove(player);
            } else if (this.dropZoneActive && this.selectedPlayerId) {
                if (this.isPlayerSelected(player)) {
                    this.unselect();
                } else {
                    this.dropPlayerHere(player);
                }
            }
        }
        
        private isPlayerSelected(player: Shared.IGamePlayer): boolean {
            return this.selectedPlayerId === player.playerId;
        }

        private markToMove(player: Shared.IGamePlayer): void {
            this.dropZoneActive = true;
            this.selectedPlayerId = player.playerId;
        }

        private unselect(): void {
            this.dropZoneActive = false;
            this.selectedPlayerId = null;
        }

        private playerIndex(playerId: string): number {
            return this.editActiveGameService.playerIndex(playerId);
        }

        private dropPlayerHere(destinationPlayer: Shared.IGamePlayer): void {
            if (!!this.selectedPlayerId) {
                this.editActiveGameService.movePlayer(this.selectedPlayerId, destinationPlayer);
            }

            this.unselect();
        }

        public removePlayer(player: Shared.IGamePlayer): void {
            this.editActiveGameService.removePlayer(player);
        }
    }
}