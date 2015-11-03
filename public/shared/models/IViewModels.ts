module Shared {
	export interface IGameViewModel {
		_id?: string;
		winner: IPlayerViewModel;
		players: IGamePlayerViewModel[];
		datePlayed: Date;
	}
	
	export interface IGamePlayerViewModel {
		_id?: string;
		player: IPlayerViewModel;
		rank?: number;
		points?: number;
	}
	
	export interface IActiveGameViewModel {
		players: IGamePlayerViewModel[];
		datePlayed?: string;
	}
	
	export interface IPlayerViewModel {
		_id?: string;
		nickname?: string;
		lastName: string;
		firstName: string;
	}
}