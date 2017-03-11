module Shared {
	export interface INewGamePlayer {
        player: IPlayer;
        playerId: string;
		rating: number;
		orderNumber?: number;
		toGamePlayerViewModel(): IGamePlayerViewModel;
		toGamePlayer(): IGamePlayer;
	}
	
	export class NewGamePlayer implements INewGamePlayer {
		public player: IPlayer;
		public rating: number;
		public orderNumber: number;
		
		constructor(player?: ICreateGamePlayerViewModel) {
			if(!player) {
				this.player = new Player();
				return;
			}
			
			this.player = new Player(player.player);
			this.rating = player.rating;
			this.orderNumber = player.orderNumber;
        }

        public get playerId(): string {
            return this.player._id;
        }
		
		public toGamePlayerViewModel(): IGamePlayerViewModel {
			var player: IGamePlayerViewModel = {
				player: this.player.toPlayerViewModel()
			}
			
			return player;
		}

		public toGamePlayer(): IGamePlayer {
			var gamePlayer = new Shared.GamePlayer();
            gamePlayer.player = this.player;
            gamePlayer.points = 0;
            gamePlayer.rank = 0;
			return gamePlayer;
		}
	}
}