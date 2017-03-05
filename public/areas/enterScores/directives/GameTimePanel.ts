module EnterScores {
    export function GameTimePanelDirective(): ng.IDirective {
        return {
            scope: {
                datePlayed: "=",
                create: "&"
            },
            templateUrl: '/areas/enterScores/directives/GametimePanelTemplate.html',
            controller: 'GameTimePanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class GameTimePanelController {
        public static $inject: string[] = [];
        private localDatePlayed: Date = null;
        private create: Function;

        private get datePlayed(): Date {
            return this.localDatePlayed;
        }

        private set datePlayed(value: Date) {
            // Once a date is selected, set it to noon to
            // default it to PM for convenience
            if(!this.localDatePlayed && !!value) {
                this.localDatePlayed = value;
                this.localDatePlayed.setHours(12);
            } else {
                this.localDatePlayed = value;
            }
        }

        private get hasDate(): boolean {
            return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
        }
        
        constructor() {
            
        }
    }
}