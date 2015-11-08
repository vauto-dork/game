module Shared {
	export interface IRankedPlayer {
		_id?: string;
		player: IPlayer;
		totalPoints?: number;
		gamesPlayed?: number;
		rating?: number;
		rank?: number;
		toRankedPlayerViewModel(): IRankedPlayerViewModel;
	}
	
	export class RankedPlayer implements IRankedPlayer {
		public _id: string;
		public player: IPlayer;
		public totalPoints: number;
		public gamesPlayed: number;
		public rating: number;
		public rank: number;
		
		constructor(player?: IRankedPlayerViewModel) {
			if(!player) {
				this.player = new Player();
				this.totalPoints = 0;
				this.gamesPlayed = 0;
				this.rating = 0;
				this.rank = 0;
				return;
			}
			
			this._id = player._id;
			this.player = new Player(player.player);
			this.totalPoints = player.totalPoints || 0;
			this.gamesPlayed = player.gamesPlayed || 0;
			this.rating = player.rating || 0;
			this.rank = 0;
		}
		
		public toRankedPlayerViewModel(): IRankedPlayerViewModel {
			var player: IRankedPlayerViewModel = {
				_id: this._id,
				player: this.player.toPlayerViewModel(),
				totalPoints: player.totalPoints,
				gamesPlayed: player.gamesPlayed,
				rating: player.rating
			}
			
			return player;
		}
	}
}