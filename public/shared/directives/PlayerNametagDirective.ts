module Shared {
    export function PlayerNametagDirective(): ng.IDirective {
        return {
			scope: {
				player: '='
			},
			templateUrl: '/shared/directives/PlayerNametagTemplate.html',
			controller: 'PlayerNametagController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class PlayerNametagController {
        public static $inject: string[] = [];
		
		private player: IPlayerViewModel;

        constructor() {
        }
    }
}

