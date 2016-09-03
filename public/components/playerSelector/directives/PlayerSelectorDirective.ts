module Components {
    export function PlayerSelectorDirective(): ng.IDirective {
        return {
            scope: {
				players: "=",
                onSelected: "&",
                disabled: "="
			},
			templateUrl: "/components/PlayerSelector/directives/PlayerSelectorTemplate.html",
			controller: "PlayerSelectorController",
			controllerAs: "ctrl",
			bindToController: true
        };
    }

	interface IPossiblePlayers {
		flatList: string;
		hasPlayers: boolean;
	}

    export class PlayerSelectorController {
        public static $inject: string[] = ["$element", "$timeout", "$filter", "playerSelectionService"];

		private players: Shared.INewGamePlayer[];
        private onSelected: Function;
        private disabled: boolean;
		private noResults: boolean;
		
		private filter: string = "";
		
        constructor(private $element: ng.IAugmentedJQuery,
			private $timeout: ng.ITimeoutService,
			private $filter: any,
			private playerSelectionService: IPlayerSelectionService) {
			
        }
		
		private removeFilter(): void {
			this.filter = "";
		}

		private selectPlayer(item: Shared.IPlayer, model, label): void {
			this.$element.find("input").focus();
			this.onSelected({ data: item });
			this.removeFilter();
		}

		private possiblePlayersAdded(): IPossiblePlayers {
			var list: string[] = this.$filter("playerSelectorFilter")(this.playerSelectionService.selectedPlayers, this.filter)
				.map((player: Shared.INewGamePlayer) => {
					return player.player.fullname;
				});
			
			return <IPossiblePlayers> {
				flatList: list.join(", "),
				hasPlayers: list.length > 0
			};
		}
    }
}
