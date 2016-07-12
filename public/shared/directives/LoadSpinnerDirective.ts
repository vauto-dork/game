module Shared {
    export function LoadSpinnerDirective(): ng.IDirective {
        return {
            scope: {
            },
            template: '<div class="load-bar"><img src="/images/loader.gif" width="220" height="19" /></div>',
            controller: 'LoadSpinnerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class LoadSpinnerController {
        public static $inject: string[] = [];
        
        constructor() {
            
        }
    }
}
