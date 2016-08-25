module Component {
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

    export class PlayerSelectorController {
        public static $inject: string[] = ["$element", "$timeout"];

		private players: Shared.INewGamePlayer[];
        private onSelected: Function;
        private disabled: boolean;
		private noResults: boolean;
		
		private filter: string = "";
		
        constructor(private $element: ng.IAugmentedJQuery, private $timeout: ng.ITimeoutService) {
			
        }
		
		private removeFilter(): void {
			this.filter = "";
		}

		private selectPlayer(item: Shared.IPlayer, model, label): void {
			this.$element.find("input").focus();
			this.onSelected({ data: item });
			this.removeFilter();
		}
    }
}
