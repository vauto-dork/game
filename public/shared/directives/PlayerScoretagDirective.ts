module Shared {
    export function PlayerScoretagDirective(): ng.IDirective {
        return {
			scope: {
				player: '='
			},
			templateUrl: '/shared/directives/PlayerScoretagTemplate.html',
			controller: 'PlayerScoretagController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }
	
	interface IPlayerScoretag extends IPlayerViewModel {
		points: number;
		rank: number;
	}

    export class PlayerScoretagController {
        public static $inject: string[] = ['$scope'];
		
		private player: IPlayerScoretag;
		private rank: any[];

        constructor(private $scope: ng.IScope) {
			var rankArray = !this.player.rank || this.player.rank === undefined ? 0 : this.player.rank;
			this.rank = new Array(rankArray);
        }
    }
}
