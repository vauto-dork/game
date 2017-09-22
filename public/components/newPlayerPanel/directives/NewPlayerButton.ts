module Components {
    export function NewPlayerButton(): ng.IComponentOptions {
        return {
            bindings: {
                click: "&",
                disabled: "="
			},
			templateUrl: "/components/newPlayerPanel/directives/NewPlayerButtonTemplate.html",
			controller: NewPlayerButtonController
        };
    }

    export class NewPlayerButtonController {
        public static $inject: string[] = [];
        
        private click: Function;
        private disabled: boolean;

        constructor() {
			
        }
    }
}
