module Shared {
	export interface IGame {
		_id?: string;
		players: IGamePlayer[];
		datePlayed?: string;
		winner?: IPlayer;
		
		getIdAsPath(): string;
		getPlayerIndex(playerId: string): number;
		addPlayer(player: IGamePlayer): void;
		removePlayer(player: Shared.IGamePlayer): void;
		movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): boolean;
		cleanRanks(playerChanged: IGamePlayer): void;
		hasFirstPlace(): boolean;
		hasSecondPlace(): boolean;
		hasThirdPlace(): boolean;
		declareWinner(): boolean;
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

		public getPlayerIndex(playerId: string): number {
			return this.players.map(p => { return p.playerId; }).indexOf(playerId);
		}

		public addPlayer(player: IGamePlayer): void {
			this.players.push(player);
		}

		public removePlayer(player: Shared.IGamePlayer): void {
			var index = this.getPlayerIndex(player.playerId);
            this.players.splice(index, 1);
		}

		public movePlayer(selectedPlayerId: string, destinationPlayer: Shared.IGamePlayer): boolean {
            var selectedPlayer = this.players.filter(p => {
                return p.playerId === selectedPlayerId;
            });

            if (selectedPlayer.length === 1) {
                var selectedPlayerIndex = this.getPlayerIndex(selectedPlayerId);
                this.players.splice(selectedPlayerIndex, 1);

                var dropIndex = this.getPlayerIndex(destinationPlayer.playerId);

                if (selectedPlayerIndex <= dropIndex) {
                    dropIndex += 1;
                }

                this.players.splice(dropIndex, 0, selectedPlayer[0]);
				return true;
            }

			return false
		}
		
		public cleanRanks(playerChanged: IGamePlayer): void {
            this.players.forEach(p => {
                if (p.playerId !== playerChanged.playerId) {
                    if (playerChanged.rank > 0 && p.rank === playerChanged.rank) {
                        p.rank = 0;
                    }
                }
            });
        }

		public hasFirstPlace(): boolean {
			return this.players.filter(value => { return value.rank === 1; }).length === 1;
		}

		public hasSecondPlace(): boolean {
			return this.players.filter(value => { return value.rank === 2; }).length === 1;
		}

		public hasThirdPlace(): boolean {
			return this.players.filter(value => { return value.rank === 3; }).length === 1;
		}

		public declareWinner(): boolean {
			var hasRanks = this.hasFirstPlace() && this.hasSecondPlace() && this.hasThirdPlace();

			if(hasRanks) {
				var winner = this.players.filter((player) => { return player.rank === 1; });
        		this.winner = winner[0].player;
			}

			return hasRanks;
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