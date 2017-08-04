module Shared {
	export interface IGame {
		_id?: string;
		players: IGamePlayer[];
		datePlayed?: string;
		winner?: IPlayer;
		getIdAsPath(): string;
		addBonusPoints(): void;
		removeBonusPoints(): void;
		toGameViewModel(): IGameViewModel;
	}
	
	export class Game implements IGame {
		public _id: string;
		public players: IGamePlayer[];
		public datePlayed: string;
		public winner: IPlayer;
		
		constructor(game?: IGameViewModel) {
			if(!game) {
				this.players = [];
				return;
			}
			
			this._id = game._id;
			this.players = game.players.map((value: IGamePlayerViewModel) => {
				return new GamePlayer(value);
			});
			this.datePlayed = game.datePlayed;
			this.winner = new Player(game.winner);
		}
		
		public getIdAsPath(): string {
			return `/${this._id}`;
		}

		public addBonusPoints(): void {
            var numPlayers = this.players.length;
            this.players.forEach(player => {
                if (player.rank === 1) {
                    player.points += numPlayers - 1;
                }
                if (player.rank === 2) {
                    player.points += numPlayers - 2;
                }
                if (player.rank === 3) {
                    player.points += numPlayers - 3;
                }
            });
        }

		public removeBonusPoints(): void {
			var numPlayers = this.players.length;
            this.players.forEach(player => {
                if (player.rank === 1) {
                    player.points -= numPlayers - 1;
                }
                if (player.rank === 2) {
                    player.points -= numPlayers - 2;
                }
                if (player.rank === 3) {
                    player.points -= numPlayers - 3;
                }
            });
		}
		
		public toGameViewModel(): IGameViewModel {
			var game: IGameViewModel = {
				_id: this._id,
				players: this.players.map((value: IGamePlayer) => {
					return value.toGamePlayerViewModel();
				}),
				datePlayed: this.datePlayed,
				winner: !this.winner ? null : this.winner.toPlayerViewModel()
			}
			
			return game;
		}
	}
}