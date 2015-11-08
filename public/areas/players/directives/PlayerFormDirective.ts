module Players {
    export function PlayerFormDirective(): ng.IDirective {
        return {
			scope: {
				player: "=",
				disableForm: "="
			},
			templateUrl: '/areas/players/directives/PlayerFormTemplate.html',
			controller: 'PlayerFormController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class PlayerFormController {
        public static $inject: string[] = ['$scope'];
		
		private playerForm: ng.IFormController;
		private player: Shared.IPlayer;
		private disableForm: boolean = false;

        constructor(private $scope: ng.IScope) {
        }
    }
}
