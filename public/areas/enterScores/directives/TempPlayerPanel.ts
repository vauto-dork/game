module EnterScores {
    export function TempPlayerPanelDirective(): ng.IDirective {
        return {
            scope: {
                player: "=",
                cancel: "&",
                add: "&"
            },
            templateUrl: '/areas/enterScores/directives/TempPlayerPanelTemplate.html',
            controller: 'TempPlayerPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class TempPlayerPanelController {
        public static $inject: string[] = ["$element", "$timeout"];

        private pointsMin: number = -4;
        private pointsMax: number = 99;

        private gamePlayer: Shared.IGamePlayer;
        private cancel: Function;
        private add: Function;

        public get player(): Shared.IGamePlayer {
            return this.gamePlayer;
        }

        public set player(value: Shared.IGamePlayer) {
            this.gamePlayer = value;
            
            if(this.$element){
                this.$timeout(() => {
                    this.$element.find(".game-score-numeric-input").click();
                });
            }
        }

        constructor(private $element: ng.IAugmentedJQuery, private $timeout: ng.ITimeoutService) {
            
        }

        public decrementScore(player: Shared.IGamePlayer): void {
            var points = player.points;
            player.points = (points - 1 >= this.pointsMin) ? points - 1 : points;
        }

        public incrementScore(player: Shared.IGamePlayer): void {
            var points = player.points;
            player.points = (points + 1 <= this.pointsMax) ? points + 1 : points;
        }
    }
}