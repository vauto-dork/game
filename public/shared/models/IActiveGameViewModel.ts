module Shared {
	export interface IActiveGameViewModel {
		players: {
			player: {
				_id: string;
			}
		}[];
		datePlayed?: Date;
	}
}