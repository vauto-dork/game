module Players {
    export function EditPlayerDirective(): ng.IDirective {
        return {
			scope: {
				player: "="
			},
			templateUrl: "/areas/players/directives/EditPlayerTemplate.html",
			controller: "EditPlayerController",
			controllerAs: "ctrl",
			bindToController: true
		};
    }

    export class EditPlayerController {
        public static $inject: string[] = ["playersListService"];
		
		private player: Shared.IPlayer;
		private disabled: boolean = false;

        constructor(private playersListService: IPlayersListService) {
			this.playersListService.subscribeEditOpen(()=>{
				this.disabled = false;
			});
        }

		private save(): void {
			this.disabled = true;
			this.playersListService.savePlayer(this.player, true);
		}

		private cancel(): void {
			this.playersListService.cancelEdit();
		}
    }
}
