module EditActiveGame {
    export function EditScoresDirective(): ng.IDirective {
        return {
            scope: {
                disabled: '='
            },
            templateUrl: '/areas/editActiveGame/directives/EditScoresTemplate.html',
            controller: 'EditScoresController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class EditScoresController {
        public static $inject: string[] = ['$scope', 'editActiveGameService'];
        
        private disabled: boolean;
        
        private pointsMin: number = -4;
        private pointsMax: number = 99;
        
        private get players(): Shared.IGamePlayer[] {
            return this.editActiveGameService.players;
        }

        constructor(private $scope: ng.IScope, private editActiveGameService: IEditActiveGameService) {
        }
        
        public rankHandler(player: Shared.IGamePlayer): void {
            player.rank = player.rank === null ? 0 : player.rank;
            
            this.players.forEach((p) => {
                if(p.playerId !== player.playerId) {
                    if(player.rank > 0 && p.rank === player.rank) {
                        p.rank = 0;
                    }
                }
            });
        }
        
        public decrementScore(player: Shared.IGamePlayer): void {
            if(!this.disabled) {
                var points = player.points;
                player.points = (points - 1 >= this.pointsMin) ? points - 1 : points;
            }
        }
        
        public incrementScore(player: Shared.IGamePlayer): void {
            if(!this.disabled) {
                var points = player.points;
                player.points = (points + 1 <= this.pointsMax) ? points + 1 : points;
            }
        };
        
        public toggleRemoved(player: Shared.IGamePlayer): void {
            player.removed = !player.removed;
        }
    }
}