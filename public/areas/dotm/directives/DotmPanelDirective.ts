module Dotm {
    export function DotmPanelDirective(): ng.IDirective {
        return {
			scope: {
				heading: "=",
				players: "="
			},
			templateUrl: '/areas/dotm/directives/DotmPanelTemplate.html',
			controller: 'DotmPanelController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class DotmPanelController {
        public static $inject: string[] = ['$scope'];
		private heading: string;
		private players: Shared.IPlayer[];

        constructor(private $scope: ng.IScope) {
        }
    }
}
