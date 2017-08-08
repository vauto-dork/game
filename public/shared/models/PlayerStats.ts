module Shared {
    export interface IPlayerStats {
        player: IPlayer,
        dateRange: Date[],
        gamesPlayed: number,
        games: IPlayerStatsGame[]
    }

    export class PlayerStats implements IPlayerStats {
        public player: IPlayer;
        public dateRange: Date[];
        public gamesPlayed: number;
        public games: IPlayerStatsGame[];

        constructor(playerStats?: IPlayerStatsViewModel) {
            if(!playerStats) {
                this.player = new Player();
                this.dateRange = [];
                this.gamesPlayed = 0;
                this.games = [];
                return;
            }

            this.player = new Player(playerStats.player);
            this.dateRange = playerStats.dateRange;
            this.gamesPlayed = playerStats.gamesPlayed;
            this.games = playerStats.games;
        }
    }
}