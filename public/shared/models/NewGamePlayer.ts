module Shared {
	export interface INewGamePlayer {
		player: IPlayer;
		rating: number;
		orderNumber?: number;
		toGamePlayerViewModel(): IGamePlayerViewModel;
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
		
		public toGamePlayerViewModel(): IGamePlayerViewModel {
			var player: IGamePlayerViewModel = {
				player: this.player.toPlayerViewModel()
			}
			
			return player;
		}
	}
}