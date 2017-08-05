module EditGame {
    export function ModifyPlayersDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: "/areas/editGame/directives/ModifyPlayersTemplate.html",
            controller: "ModifyPlayersController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }

    export class ModifyPlayersController extends Components.NewPlayerPanelBase {
        public static $inject: string[] = ["editGameService", "playerSelectionService", "newPlayerPanelService", "editGameCollapseService"];
        
        private get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.editGameService.unselectedPlayers;
        }

        private get movePlayerActive(): boolean {
            return this.editGameService.movePlayerActive;
        }
        
        constructor(
            private editGameService: IEditGameService,
            private playerSelectionService: Components.IPlayerSelectionService,
            private newPlayerPanelService: Components.INewPlayerPanelService,
            private editGameCollapseService: IEditGameCollapseService) {
            super();

            this.newPlayerPanelService.subscribeFormCancel(() => {
				this.disableAddNewPlayer();
			});

			this.newPlayerPanelService.subscribeSavedPlayer(() => {
				this.disableAddNewPlayer();
			});
        }

        private onSelected(data: Shared.INewGamePlayer): void {
            var player = new Shared.GamePlayer(data.toGamePlayerViewModel());
            this.editGameService.addPlayer(player);
        }

        private back(): void {
            this.editGameCollapseService.disableModifyPlayers();
        }

        protected enablePlayerSelectorPanel(): void {
			this.playerSelectionService.removeFilter();
			super.enablePlayerSelectorPanel();
		}
    }
}