module EnterScores {
    export function GameTimePanelDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: '/areas/enterScores/directives/GametimePanelTemplate.html',
            controller: 'GameTimePanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class GameTimePanelController {
        public static $inject: string[] = ["enterScoresService"];

        private get datePlayed(): Date {
            return this.enterScoresService.datePlayed;
        }

        private set datePlayed(value: Date) {
            // Once a date is selected, set it to noon to
            // default it to PM for convenience
            if(!this.enterScoresService.datePlayed && !!value) {
                this.enterScoresService.datePlayed = value;
                this.enterScoresService.datePlayed.setHours(12);
            } else {
                this.enterScoresService.datePlayed = value;
            }
        }

        private get hasDate(): boolean {
            return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
        }
        
        constructor(private enterScoresService: IEnterScoresService) {
            
        }

        private create(): void {
            this.enterScoresService.createGame();
        }
    }
}