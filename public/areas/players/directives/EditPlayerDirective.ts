module Players {
    export function EditPlayerDirective(): ng.IDirective {
        return {
			scope: {
				player: "=",
				disableForm: "="
			},
			templateUrl: "/areas/players/directives/PlayerFormTemplate.html",
			controller: "PlayerFormController",
			controllerAs: "ctrl",
			bindToController: true
		};
    }

    export class EditPlayerController {
        public static $inject: string[] = ["playersListService"];
		
		private playerForm: ng.IFormController;
		private player: Shared.IPlayer;
		private disableForm: boolean = false;

        constructor(private playersListService: IPlayersListService) {
        }

		private save(): void {
			this.playersListService.savePlayer(this.player);
		}
    }
}
