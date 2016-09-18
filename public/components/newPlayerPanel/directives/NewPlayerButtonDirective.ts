module Components {
    export function NewPlayerButtonDirective(): ng.IDirective {
        return {
            scope: {
                click: "&",
                disabled: "="
			},
			templateUrl: "/components/newPlayerPanel/directives/NewPlayerButtonTemplate.html",
			controller: "NewPlayerButtonController",
			controllerAs: "ctrl",
			bindToController: true
        };
    }

    export class NewPlayerButtonController {
        private click: Function;
        private disabled: boolean;

        constructor() {
			
        }
    }
}
