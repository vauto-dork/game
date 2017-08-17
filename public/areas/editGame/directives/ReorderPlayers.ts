module EditGame {
    export function ReorderPlayers(): ng.IComponentOptions {
        return {
            templateUrl: '/areas/editGame/directives/ReorderPlayersTemplate.html',
            controller: ReorderPlayersController
        };
    }

    export class ReorderPlayersController {
        public static $inject: string[] = ['editGameService'];
        
        private selectedPlayerId: string;

        private get dropZoneActive(): boolean {
            return this.editGameService.movePlayerActive;
        }

        private set dropZoneActive(value: boolean) {
            this.editGameService.movePlayerActive = value;
        }

        private get players(): Shared.IGamePlayer[] {
            return this.editGameService.players;
        }

        private set players(value: Shared.IGamePlayer[]) {
            this.editGameService.players = value;
        }

        constructor(private editGameService: IEditGameService) {
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

        private dropPlayerHere(destinationPlayer: Shared.IGamePlayer): void {
            if (!!this.selectedPlayerId) {
                this.editGameService.movePlayer(this.selectedPlayerId, destinationPlayer);
            }

            this.unselect();
        }

        public removePlayer(player: Shared.IGamePlayer): void {
            this.editGameService.removePlayer(player);
        }
    }
}