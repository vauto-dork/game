module Rankings {
    export function RankingsCardDirective(): ng.IDirective {
        return {
            scope: {
                player: "="
            },
            templateUrl: '/areas/rankings/directives/RankingsCardTemplate.html',
            controller: 'RankingsCardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    export class RankingsCardController {
        public static $inject: string[] = ['$scope'];
        private player: Shared.IRankedPlayer;

        constructor(private $scope: ng.IScope) {
        }
    }
}
