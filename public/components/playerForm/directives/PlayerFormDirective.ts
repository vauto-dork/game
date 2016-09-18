module Components {
    export function PlayerFormDirective(): ng.IDirective {
        return {
			scope: {
				player: "=",
				disableForm: "=?"
			},
			templateUrl: "/components/playerForm/directives/PlayerFormTemplate.html",
			controller: "PlayerFormController",
			controllerAs: "ctrl",
			bindToController: true
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
