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

        private datePlayed: Date;

        constructor(private enterScoresService: IEnterScoresService) {

        }

        private createGame(): void {
            console.info("creating game");
        }
    }
}