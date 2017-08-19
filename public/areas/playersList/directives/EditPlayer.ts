module PlayersList {
    export function EditPlayer(): ng.IComponentOptions {
        return {
			bindings: {
				player: "="
			},
			templateUrl: "/areas/playersList/directives/EditPlayerTemplate.html",
			controller: EditPlayerController
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
