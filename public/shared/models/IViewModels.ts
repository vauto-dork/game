module Shared {
	export interface IGameViewModel {
		_id?: string;
		winner: IPlayerViewModel;
		players: IGamePlayerViewModel[];
		datePlayed: string;
	}
	
	export interface IGamePlayerViewModel {
		_id?: string;
		player: IPlayerViewModel;
		rank?: number;
		points?: number;
	}
	
	export interface IRankedPlayerViewModel {
		_id?: string;
		player: IPlayerViewModel;
		totalPoints?: number;
		gamesPlayed?: number;
		rating?: number;
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