module ActiveGame {
    export function ActiveGamesDirective(): ng.IDirective {
        return {
            scope: {
            },
            templateUrl: '/areas/activeGame/directives/ActiveGamesTemplate.html',
			controller: 'ActiveGamesController',
			controllerAs: 'ctrl',
			bindToController: true
        };
    }
	
	enum State {
		Loading,
		NoGames,
		Loaded,
		Error
	};

    export class ActiveGamesController {
        public static $inject: string[] = ['apiService'];
		
		private loading: boolean = false;
		private showNoGamesWarning: boolean = false;
		private showErrorMessage: boolean = false;
		
		private games: Shared.IGame[];
		private errorMessage: string = '';

        constructor(private apiService: Shared.IApiService) {
			this.changeState(State.Loading);
        }
		
		private changeState(newState): void {
			this.loading = newState === State.Loading;
			this.showErrorMessage = newState === State.Error;
			this.showNoGamesWarning = newState === State.NoGames;
            
			switch(newState){
                case State.Loading:
                    this.getGames();
					break;
			}
		}
		
		private errorHandler(data, errorMessage): void {
			this.errorMessage = errorMessage;
			console.error(data);
			this.changeState(State.Error);
		}
		
		// Dont call directly. Change state to "Loading" instead.
		private getGames(): void {
			this.apiService.getAllActiveGames().then((data) => {
				if(!data || data.length === 0){
					this.games = [];
					this.changeState(State.NoGames);
					return;
				}
				
				this.games = data;
				this.changeState(State.Loaded);
			}, (data) => {
				this.errorHandler(data, 'Error fetching games!');
			});
		}
		
		private reload(): void {
			this.changeState(State.Loading);
		}
    }
}
