module Shared {
	export interface IGameViewModel {
		_id?: string;
		players: IGamePlayerViewModel[];
		datePlayed?: string;
		winner?: IPlayerViewModel;
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
	
	export interface IPlayerViewModel {
		_id?: string;
		customInitials?: string;
		nickname?: string;
		lastName: string;
		firstName: string;
		duplicate?: string;
		inactive?: boolean;
	}
	
	export interface IDotmViewModel {
		uberdorks: IRankedPlayerViewModel[],
		negadorks: IRankedPlayerViewModel[]
	}
	
	export interface ICreateGameViewModel {
		firstGameOfMonth: boolean;
		players: ICreateGamePlayerViewModel[];
	}
	
	export interface ICreateGamePlayerViewModel {
		player: IPlayerViewModel;
		orderNumber: number;
		rating: number;
	}
}