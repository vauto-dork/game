module Players {
    export interface IPlayersListService {
        players: Shared.IPlayer[];

        ready(): ng.IPromise<void>;
        loadPlayers(): ng.IPromise<void>;
        savePlayer(player: Shared.IPlayer): ng.IPromise<void>;
    }

    export class PlayersListService implements IPlayersListService {
        public static $inject: string[] = ['$q', 'apiService', 'playerSelectionService'];

        private playerLoadPromise: ng.IPromise<void>;
        private allPlayers: Shared.IPlayer[];
        private selPlayer: Shared.IPlayer;

        public get players(): Shared.IPlayer[] {
            return this.allPlayers;
        }

        constructor(private $q: ng.IQService,
            private apiService: Shared.IApiService,
            private playerSelectionService: Shared.IPlayerSelectionService) {
            this.playerLoadPromise = this.loadPlayers();
        }

        public ready(): ng.IPromise<void> {
            return this.playerLoadPromise;
        }

        public loadPlayers(): ng.IPromise<void> {
			return this.apiService.getAllPlayers().then((data: Shared.IPlayer[]) => {
				this.allPlayers = data;
                this.$q.resolve();
			}, (data) => {
				this.$q.reject(data);
			});
		}

        public savePlayer(player: Shared.IPlayer): ng.IPromise<void> {
			return this.apiService.saveExistingPlayer(player).then(() => {
				this.$q.resolve();
			}, (data: string) => {
				this.$q.reject(data);
			});
		}
    }
}