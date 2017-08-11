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
		public customInitials: string;
		public duplicate: string;
		public inactive: boolean;
		public urlId: string;
		
		public get initials(): string {
			return this.customInitials || (this.firstName.charAt(0) + this.lastName.charAt(0));
		}
		
		public get fullname(): string {
			return `${this.firstName} ${this.lastName}`;
		}
		
		constructor(player?: IPlayerViewModel) {
			if(!player) {
				this.firstName = '';
				this.lastName = '';
				this.nickname = '';
				this.customInitials = '';
				this.duplicate = '';
				this.inactive = false;
				this.urlId = '';
				return;
			}
			
			this._id = player._id;
			this.firstName = player.firstName;
			this.lastName = player.lastName;
			this.nickname = player.nickname;
			this.customInitials = player.customInitials;
			this.duplicate = player.duplicate;
			this.inactive = player.inactive;
			this.urlId = player.urlId;
		}
		
		public toPlayerViewModel(): IPlayerViewModel {
			var player: IPlayerViewModel = {
				_id: this._id,
				firstName: this.firstName,
				lastName: this.lastName,
				nickname: this.nickname,
				customInitials: this.customInitials,
				duplicate: this.duplicate,
				inactive: this.inactive
			}
			
			return player;
		}
	}
}