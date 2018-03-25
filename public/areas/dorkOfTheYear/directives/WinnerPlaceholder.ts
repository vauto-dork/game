module DorkOfTheYear {
    export function WinnerPlaceholder(): ng.IComponentOptions {
        return {
			templateUrl: '/areas/dorkOfTheYear/directives/WinnerPlaceholderTemplate.html',
            controller: WinnerPlaceholderController,
            bindings: {
				pastGame: "="
			}
		};
    }

    export class WinnerPlaceholderController {
		public static $inject: string[] = ['dotyService'];
        
        private player: Shared.IRankedPlayer;
        private pastGame: boolean;

        constructor(private dotyService: IDotyService) {
            this.player = new Shared.RankedPlayer();
            this.player.player.firstName = this.pastGame ? "No" : "This could";
            this.player.player.lastName = this.pastGame ? "Uberdork" : "be you!";
            this.player.player.customInitials = "—";
            this.player.rating = 0;
            this.player.totalPoints = 0;
            this.player.gamesPlayed = 0;
        }
    }
}

