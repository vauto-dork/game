module Shared {
	export interface INewGame {
		firstGameOfMonth: boolean;
		players: INewGamePlayer[];
	}
	
	export class NewGame implements INewGame {
		firstGameOfMonth: boolean;
		players: INewGamePlayer[];
		
		constructor(game?: ICreateGameViewModel) {
			if(!game) {
				this.firstGameOfMonth = true;
				this.players = [];
				return;
			}
			
			this.firstGameOfMonth = game.firstGameOfMonth;
			this.players = game.players.map((value) => {
				return new NewGamePlayer(value);
			});
		}
	}
}