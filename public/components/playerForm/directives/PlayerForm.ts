module Components {
    export function PlayerForm(): ng.IComponentOptions {
        return {
			bindings: {
				player: "=",
				disableForm: "=?"
			},
			templateUrl: "/components/playerForm/directives/PlayerFormTemplate.html",
			controller: PlayerFormController
		};
    }

    export class PlayerFormController {
        public static $inject: string[] = [];
		
		private playerForm: ng.IFormController;
		private player: Shared.IPlayer;
		private disableForm: boolean;

        constructor() {
        }
    }
}
