module EditGame {
    export function RevertFinalizeDirective(): ng.IDirective {
        return {
            scope: {
                save: "&",
                revert: "&",
                finalize: "&",
                update: "&",
                disabled: "="
            },
            templateUrl: '/areas/editGame/directives/RevertFinalizeTemplate.html',
            controller: 'RevertFinalizeController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class RevertFinalizeController {
        public static $inject: string[] = ['editGameService'];

        private save: Function;
        private revert: Function;
        private finalize: Function;
        private update: Function;
        private disabled: boolean;

        private get numPlayers(): number {
            return this.editGameService.players.length;
        }

        private get isFinalizedGame(): boolean {
            return this.editGameService.gameType === EditGameType.FinalizedGame;
        }

        constructor(private editGameService: IEditGameService) {
            
        }
    }
}