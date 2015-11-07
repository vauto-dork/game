module Shared {
	export interface IPlayer extends IPlayerViewModel {
		initials: string;
		fullname: string;
		toPlayerViewModel(): IPlayerViewModel;
	}
	
	export class Player implements IPlayer {
		public _id: string;
		public firstName: string;
		public lastName: string;
		public nickname: string;
		public initials: string;
		public fullname: string;
		
		constructor(player: IPlayerViewModel) {
			this._id = player._id;
			this.firstName = player.firstName;
			this.lastName = player.lastName;
			this.nickname = player.nickname;
			this.fullname = `${player.firstName} ${player.lastName}`;
			this.initials = player.firstName.charAt(0) + player.lastName.charAt(0);
		}
		
		public toPlayerViewModel(): IPlayerViewModel {
			var player: IPlayerViewModel = {
				_id: this._id,
				firstName: this.firstName,
				lastName: this.lastName,
				nickname: this.nickname
			}
			
			return player;
		}
	}
}