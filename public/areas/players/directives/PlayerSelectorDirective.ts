module Players {
    export function PlayerSelectorDirective(): ng.IDirective {
        return {
            scope: {
				players: '=',
				onSelected: '&'
			},
			templateUrl: '/areas/players/directives/PlayerSelectorTemplate.html',
			controller: 'PlayerSelectorController',
			controllerAs: 'ctrl',
			bindToController: true
        };
    }

    export class PlayerSelectorController {
        public static $inject: string[] = ['$scope', '$element', '$timeout'];

		// TODO: Possibly IPlayer, but missing data until conversion of Active Games.
		private players: any[];
		private onSelected: Function;
		
		private filter: string = '';
		
        constructor(private $scope: ng.IScope, private $element: ng.IAugmentedJQuery, private $timeout: ng.ITimeoutService) {
			$scope.$on('PlayerSelectorFocus', (event, data) => {
				// Wrapped in timeout so it does this after UI is rendered.
				$timeout(() => {
					$element.find("input").focus();
				});
			});

			$scope.$on('PlayerSelectorBlur', (event, data) => {
				// UI should be already rendered at this point so timeout is not needed.
				$element.find("input").blur();
			});
        }

		private removeFilter(): void {
			this.filter = '';
		}

		private selectPlayer(item, model, label): void {
			this.$element.find("input").focus();
			this.onSelected({ data: item });
			this.removeFilter();
		}

		private getUnselectedPlayers(): any[] {
			return this.players.filter((element) => {
				return !element.selected;
			});
		};
    }
}
