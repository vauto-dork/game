module EnterScores {
    export function ScoreFormPanelDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: "/areas/enterScores/directives/ScoreFormPanelTemplate.html",
            controller: "ScoreFormPanelController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }


    export class ScoreFormPanelController {
        public static $inject: string[] = ["$timeout", "$element", "enterScoresService"];

        private tempPlayer: Shared.IGamePlayer;
        private showTempPlayerPanel: boolean = false;

        private get datePlayed(): Date {
            return this.enterScoresService.datePlayed;
        }

        private set datePlayed(value: Date) {
            this.enterScoresService.datePlayed = value;
        }

        public get players(): Shared.IGamePlayer[] {
            return this.enterScoresService.players;
        }

        constructor(
            private $timeout: ng.ITimeoutService,
            private $element: ng.IAugmentedJQuery,
            private enterScoresService: IEnterScoresService) {

        }

        private playerSelect(data: Shared.INewGamePlayer): void {
            this.tempPlayer = data.toGamePlayer();
            this.showTempPlayerPanel = true;
		}

        private closeTempPlayerPanel(): void {
            this.showTempPlayerPanel = false;
            this.tempPlayer = null;
            
            this.$timeout(() => {
                this.$element.find(".player-selector").find("input").focus();
            });
        }

        private addPlayer(): void {
            this.enterScoresService.addPlayer(this.tempPlayer);
            this.enterScoresService.changePlayerPoints(this.tempPlayer.playerId, this.tempPlayer.points);
            this.closeTempPlayerPanel();
        }

        private get unselectedPlayers(): Shared.INewGamePlayer[] {
			return this.enterScoresService.unselectedPlayers;
		}
    }
}