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
        public static $inject: string[] = [];

        private save: Function;
        private revert: Function;
        private finalize: Function;
        private disabled: boolean;

        constructor() {
            
        }
    }
}