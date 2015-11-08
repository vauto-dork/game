module Shared {
	export interface IGame {
		_id?: string;
		players: IGamePlayer[];
		datePlayed?: string;
		winner?: IPlayer;
		toGameViewModel(): IGameViewModel;
	}
	
	export class Game implements IGame {
		public _id: string;
		public players: IGamePlayer[];
		public datePlayed: string;
		public winner: IPlayer;
		
		constructor(game: IGameViewModel) {
			this._id = game._id;
			this.players = game.players.map((value: IGamePlayerViewModel) => {
				return new GamePlayer(value);
			});
			this.datePlayed = game.datePlayed;
			this.winner = game.winner;
		}
		
		public toGameViewModel(): IGameViewModel {
			var game: IGameViewModel = {
				_id: this._id,
				players: this.players.map((value: IGamePlayer) => {
					return value.toGamePlayerViewModel();
				}),
				datePlayed: this.datePlayed,
				winner: this.winner.toPlayerViewModel()
			}
			
			return game;
		}
	}
}