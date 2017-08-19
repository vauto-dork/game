module EditGame {
    export function EditScores(): ng.IComponentOptions {
        return {
            bindings: {
                disabled: '='
            },
            templateUrl: '/areas/editGame/directives/EditScoresTemplate.html',
            controller: EditScoresController
        };
    }

    export class EditScoresController {
        public static $inject: string[] = ['editGameService'];

        private disabled: boolean;

        private pointsMin: number = Shared.GamePointsRange.min;
        private pointsMax: number = Shared.GamePointsRange.max;

        private get players(): Shared.IGamePlayer[] {
            return this.editGameService.players;
        }

        private set players(value: Shared.IGamePlayer[]) {
            this.editGameService.players = value;
        }

        constructor(private editGameService: IEditGameService) {
        }

        public rankHandler(player: Shared.IGamePlayer): void {
            this.editGameService.cleanRanks(player);
        }

        public decrementScore(player: Shared.IGamePlayer): void {
            if (!this.disabled) {
                player.decrementScore();
            }
        }

        public incrementScore(player: Shared.IGamePlayer): void {
            if (!this.disabled) {
                player.incrementScore();
            }
        }
    }
}