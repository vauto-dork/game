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

        constructor(private enterScoresService: IEnterScoresService) {

        }
    }
}