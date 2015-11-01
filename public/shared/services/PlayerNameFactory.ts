module Shared {
	export interface IPlayerNameFactory {
		PlayerNameFormat(player: IPlayerViewModel): IPlayer;
	}
	
	export class PlayerNameFactory implements IPlayerNameFactory {
		public PlayerNameFormat(player: IPlayerViewModel): IPlayer {
			var newPlayer: IPlayer = {
				_id: player._id,
				__v: player.__v,
				firstName: player.firstName,
				lastName: player.lastName,
				nickname: player.nickname,
				fullname: `${player.firstName} ${player.lastName}`,
				initials: player.firstName.charAt(0) + player.lastName.charAt(0)
			};
			
			return newPlayer;
		}
	}
}