module Shared {
    export interface IPlayerStats {
        player: IPlayer,
        dateRange: Date[],
        totalPoints: number,
        gamesPlayed: number,
        games: IPlayerStatsGame[]
    }

    export class PlayerStats implements IPlayerStats {
        public player: IPlayer;
        public dateRange: Date[];
        public gamesPlayed: number;
        public totalPoints: number;
        public games: IPlayerStatsGame[];

        constructor(playerStats?: IPlayerStatsViewModel) {
            if(!playerStats) {
                this.player = new Player();
                this.dateRange = [];
                this.totalPoints = 0;
                this.gamesPlayed = 0;
                this.games = [];
                return;
            }

            this.player = new Player(playerStats.player);
            this.dateRange = playerStats.dateRange;
            this.totalPoints = playerStats.totalPoints;
            this.gamesPlayed = playerStats.gamesPlayed;
            this.games = playerStats.games;
        }
    }
}