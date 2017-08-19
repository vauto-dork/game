module Shared {
    export function LoadSpinner(): ng.IComponentOptions {
        return {
            template: '<div class="load-bar"><img src="/images/loader.gif" width="220" height="19" /></div>',
            controller: LoadSpinnerController
        };
    }

    export class LoadSpinnerController {
        public static $inject: string[] = [];
        
        constructor() {
            
        }
    }
}
