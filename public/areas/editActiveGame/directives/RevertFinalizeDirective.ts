module EditActiveGame {
    export function RevertFinalizeDirective(): ng.IDirective {
        return {
            scope: {
                save: "&",
                revert: "&",
                finalize: "&",
                disabled: "="
            },
            templateUrl: '/areas/editActiveGame/directives/RevertFinalizeTemplate.html',
            controller: 'RevertFinalizeController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class RevertFinalizeController {
        public static $inject: string[] = ['editActiveGameService'];

        private save: Function;
        private revert: Function;
        private finalize: Function;
        private disabled: boolean;

        private get numPlayers(): number {
            return this.editActiveGameService.players.length;
        }

        constructor(private editActiveGameService: IEditActiveGameService) {
            
        }
    }
}