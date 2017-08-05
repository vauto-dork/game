module Shared {
	export interface IGamePlayer {
        // From/To ViewModel
        player: IPlayer;
        playerId: string;
		rank?: number;
		points?: number;
		decrementScore(): void;
		incrementScore(): void;
        toGamePlayerViewModel(): IGamePlayerViewModel;
	}
	
	export class GamePlayer implements IGamePlayer {
		public _id: string;
		public player: IPlayer;
		public rank: number;
		public points: number;
		
		constructor(player?: IGamePlayerViewModel) {
			if(!player) {
				this.player = new Player();
				return;
			}
			
			this._id = player._id;
			this.player = new Player(player.player);
			this.rank = player.rank || 0;
			this.points = player.points || 0;
        }

        public get playerId(): string {
            return this.player._id;
		}
		
		public decrementScore(): void {
            var points = this.points || 0;
			this.points = (points - 1 >= GamePointsRange.min) ? points - 1 : points;
        }

        public incrementScore(): void {
            var points = this.points || 0;
			this.points = (points + 1 <= GamePointsRange.max) ? points + 1 : points;
        }
		
		public toGamePlayerViewModel(): IGamePlayerViewModel {
			var player: IGamePlayerViewModel = {
				_id: this._id,
				player: this.player.toPlayerViewModel(),
				rank: this.rank || 0,
				points: this.points || 0
			}
			
			return player;
        }
	}
}