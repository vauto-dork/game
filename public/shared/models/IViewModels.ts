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
		urlId?: string;
	}
	
	export interface IDotmViewModel {
		uberdorks: IRankedPlayerViewModel[],
		negadorks: IRankedPlayerViewModel[]
	}

	export interface IDotyViewModel {
		year: number;
		doty: IRankedPlayerViewModel[];
		monthlyRankings: IDotyMonthModel[];
	}

	export interface IDotyMonthModel {
		month: number;
		uberdorks: (IRankedPlayer|IRankedPlayerViewModel)[];
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

	export interface IPlayerStatsGame {
		gameId: string,
		gameDate: Date,
		played: boolean,
		rating: number,
		ratingDiff: number,
		ratingPctDiff: number,
		rank: number,
		rankDiff: number
	}

	export interface IPlayerStatsViewModel {
		player: IPlayerViewModel,
		dateRange: Date[],
		totalPoints: number,
		gamesPlayed: number,
		games: IPlayerStatsGame[]
	}
}