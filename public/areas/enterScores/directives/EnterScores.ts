module EnterScores {
    export function EnterScoresDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: "/areas/enterScores/directives/EnterScoresTemplate.html",
            controller: "EnterScoresController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }

    export class EnterScoresController {
        public static $inject: string[] = ["enterScoresService"];

        private get showGameTimePanel(): boolean {
            return this.enterScoresService.state === ScoreFormState.DateSelect;
        }

        private get showScoreFormPanel(): boolean {
            return this.enterScoresService.state === ScoreFormState.ScoreEntry;
        }

        constructor(private enterScoresService: IEnterScoresService) {

        }
    }
}