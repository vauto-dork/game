module PlayerStats {
    import IPlayerStats = Shared.IPlayerStats;
    import IPlayerStatsGame = Shared.IPlayerStatsGame;

    export interface IPlayerStatsService {
        playerStats: IPlayerStats;
        latestGame: IPlayerStatsGame;
        hasPlayedGames: boolean;

        getPlayerStats(): ng.IPromise<void>;
    }

    export class PlayerStatsService {
        public static $inject: string[] = ["$q", "playerId", "apiService"];
        
        private localLoading: boolean;
        private localPlayerStats: IPlayerStats;

        public get playerStats(): IPlayerStats {
            return this.localPlayerStats;
        }

        public get latestGame(): IPlayerStatsGame {
            if(this.localPlayerStats && this.localPlayerStats.games) {
                return this.localPlayerStats.games[0];
            }

            return null;
        }

        public get hasPlayedGames(): boolean {
            return !this.playerStats ? false : this.playerStats.gamesPlayed > 0;
        }

        constructor(
            private $q: ng.IQService,
            private playerId: string,
            private apiService: Shared.IApiService)
        {
            this.getPlayerStats();
        }

        public getPlayerStats(): ng.IPromise<void> {
            var def = this.$q.defer<void>();

            this.apiService.getPlayerStats(this.playerId).then((playerStats) => {
                this.localPlayerStats = playerStats;
                def.resolve();
            }, () => {
                def.reject();
            });

            return def.promise;
        }
    }   
}