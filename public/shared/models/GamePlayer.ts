module Shared {
	export interface IGamePlayer {
		_id?: string;
		player: IPlayer;
		rank?: number;
		points?: number;
		toGamePlayerViewModel(): IGamePlayerViewModel;
	}
	
	export class GamePlayer implements IGamePlayer {
		public _id: string;
		public player: IPlayer;
		public rank: number;
		public points: number;
		
		constructor(player: IGamePlayerViewModel) {
			this._id = player._id;
			this.player = new Player(player.player);
			this.rank = player.rank || 0;
			this.points = player.points || 0;
		}
		
		public toGamePlayerViewModel(): IGamePlayerViewModel {
			var player: IGamePlayerViewModel = {
				_id: this._id,
				player: this.player.toPlayerViewModel(),
				rank: this.rank,
				points: this.points
			}
			
			return player;
		}
	}
}