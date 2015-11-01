module Shared {
	export interface IGameViewModel {
		_id: string;
		__v: number;
		winner: IPlayerViewModel;
		players: IGamePlayerViewModel[];
		datePlayed: Date;
	}
}