module Components {
    export function NewPlayerPanelDirective(): ng.IDirective {
        return {
            scope: {
			},
			templateUrl: "/components/newPlayerPanel/directives/NewPlayerPanelTemplate.html",
			controller: "NewPlayerPanelController",
			controllerAs: "ctrl",
			bindToController: true
        };
    }

    export class NewPlayerPanelController {
        public static $inject: string[] = ["$element", "$timeout", "$filter", "playerSelectionService"];

        constructor(private $element: ng.IAugmentedJQuery,
			private $timeout: ng.ITimeoutService,
			private $filter: any,
			private playerSelectionService: IPlayerSelectionService) {
			
        }
    }
}
