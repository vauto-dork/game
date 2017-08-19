module Shared {
    export function PlayerNametag(): ng.IComponentOptions {
        return {
			bindings: {
				player: '='
			},
			templateUrl: '/shared/directives/PlayerNametagTemplate.html',
			controller: PlayerNametagController
		};
    }

    export class PlayerNametagController {
        public static $inject: string[] = [];
		
		private player: IPlayerViewModel;

        constructor() {
        }
    }
}

