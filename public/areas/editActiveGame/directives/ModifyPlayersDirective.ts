module EditActiveGame {
    export function ModifyPlayersDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: "/areas/editActiveGame/directives/ModifyPlayersTemplate.html",
            controller: "ModifyPlayersController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }

    export class ModifyPlayersController extends Components.NewPlayerPanelBase {
        public static $inject: string[] = ["editActiveGameService", "newPlayerPanelService", "editActiveGameCollapseService"];
        
        private get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.editActiveGameService.unselectedPlayers;
        }

        private get movePlayerActive(): boolean {
            return this.editActiveGameService.movePlayerActive;
        }
        
        constructor(
            private editActiveGameService: IEditActiveGameService,
            private newPlayerPanelService: Components.INewPlayerPanelService,
            private editActiveGameCollapseService: IEditActiveGameCollapseService) {
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
            this.editActiveGameService.addPlayer(player);
        }

        private back(): void {
            this.editActiveGameCollapseService.disableModifyPlayers();
        }
    }
}