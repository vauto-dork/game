module Components {
    export function WinnerPlaceholder(): ng.IComponentOptions {
        return {
			templateUrl: '/components/doty/directives/WinnerPlaceholderTemplate.html',
			controller: WinnerPlaceholderController
		};
    }

    export class WinnerPlaceholderController {
		public static $inject: string[] = ['dotyService'];
        
        private player: Shared.IRankedPlayer;

        constructor(private dotyService: IDotyService) {
            this.player = new Shared.RankedPlayer();
            this.player.player.firstName = "Robert";
            this.player.player.lastName = "Paulson";
            this.player.rating = 5.363;
            this.player.totalPoints = 59;
            this.player.gamesPlayed = 11;
        }
    }
}

