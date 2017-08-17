module Shared {
    export function PlayerScoretag(): ng.IComponentOptions {
        return {
			bindings: {
				player: '='
			},
			templateUrl: '/shared/directives/PlayerScoretagTemplate.html',
			controller: PlayerScoretagController
		};
    }

    export class PlayerScoretagController {
        public static $inject: string[] = [];
		
		private player: IGamePlayer;
		private rank: any[]; // This is a number array for looping to print the dots above player name.
		
		private get playerName(): IPlayer {
			return this.player.player;
		}

        constructor() {
			var rankArray = !this.player.rank ? 0 : this.player.rank;
			this.rank = new Array(rankArray);
        }
    }
}
