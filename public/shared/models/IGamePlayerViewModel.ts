module Shared {
	export interface IGamePlayerViewModel {
		_id: string;
		player: IPlayerViewModel;
		rank?: number;
		points?: number;
	}
}