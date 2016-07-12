module CreateGame {
    export function ButtonsPanelDirective(): ng.IDirective {
        return {
            scope: {
                datePlayed: "=",
                create: "&"
            },
            templateUrl: '/areas/createGame/directives/ButtonsPanelTemplate.html',
            controller: 'ButtonsPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class ButtonsPanelController {
        public static $inject: string[] = ['$window', 'createGameService'];
        private datePlayed: Date = null;
        private create: Function;

        private get hasDate(): boolean {
            return this.datePlayed !== null && this.datePlayed !== undefined && this.datePlayed.toISOString() !== "";
        }
        
        private get hasSelectedPlayers(): boolean {
            return this.createGameService.numPlayers > 0;
        }

        constructor(private $window: ng.IWindowService, private createGameService: ICreateGameService) {
        }

        private reset(): void {
            this.datePlayed = null;
            this.createGameService.reset();
        }

        private useCurrentDateTime(): void {
            this.datePlayed = new Date();
        }

        private get disableGameCreation(): boolean {
            return !this.hasDate || !this.createGameService.hasMinimumPlayers;
        }
    }
}