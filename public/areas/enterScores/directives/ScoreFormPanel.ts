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
        public static $inject: string[] = ["enterScoresService"];

        private get datePlayed(): Date {
            return this.enterScoresService.datePlayed;
        }

        private set datePlayed(value: Date) {
            this.enterScoresService.datePlayed = value;
        }

        constructor(private enterScoresService: IEnterScoresService) {

        }
    }
}