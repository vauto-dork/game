module Components {
    export interface IPlayerSelectionService {
        filter: string;
        selectedPlayers: Shared.INewGamePlayer[];
        unselectedPlayers: Shared.INewGamePlayer[];

        reset(): void;
        removeFilter(): void;
        getPlayers(): ng.IPromise<Shared.INewGame>;
        addPlayer(player: Shared.IPlayer): void;
        removePlayer(player: Shared.IPlayer): void;
        curateNewPlayerList(): void;

        debugShowAllPlayersTable(): void;
        debugShowCuratedPlayersTable(): void;
        debugPrintPlayersTable(players: Shared.INewGamePlayer[]): void;
    }

    export class PlayerSelectionService implements IPlayerSelectionService {
        public static $inject: string[] = ["$q", "apiService"];

        private localFilter: string = "";
        private allPlayers: Shared.INewGamePlayer[] = [];
        private players: Shared.INewGamePlayer[] = [];
        private unselectedPlayersList: Shared.INewGamePlayer[] = [];
        
        public get selectedPlayers(): Shared.INewGamePlayer[] {
            return this.players;
        }

        public get unselectedPlayers(): Shared.INewGamePlayer[] {
            return this.unselectedPlayersList;
        }

        public get filter(): string{
            return this.localFilter;
        }

        public set filter(value: string) {
            this.localFilter = value;
        }

        constructor(private $q: ng.IQService, private apiService: Shared.IApiService) {

        }
        
        private playerIndex(playerId: string): number {
            return this.players.map(p => { return p.playerId; }).indexOf(playerId);
        }

        public removeFilter(): void {
            this.filter = "";
        }

        public addPlayer(player: Shared.IPlayer): void {
            var found = this.allPlayers.filter(p => { return p.playerId === player._id });

            if (found.length === 1) {
                this.players.push(found[0]);
                this.curateNewPlayerList();
            } else {
                console.error("Player not found.", player);
            }
        }

        public removePlayer(player: Shared.IPlayer): void {
            var index = this.playerIndex(player._id);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        }

        public getPlayers(): ng.IPromise<Shared.INewGame> {
            var def = this.$q.defer<Shared.INewGame>();

            this.apiService.getPlayersForNewGame().then(data => {
                this.allPlayers = data.players;
                def.resolve(data);
            }, () => {
                this.allPlayers = [];
                def.reject();
            });

            return def.promise;
        }

        public curateNewPlayerList(): void {
            // Get the nested player before getting ID because IDs don't match
            var currentPlayerIds = this.players.map(p => p.playerId);

            // Get players that are not in the current playlist.
            this.unselectedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        }

        public reset(): void {
            this.players = [];
            this.curateNewPlayerList();
        }

        // Debug functions

        public debugShowAllPlayersTable(): void {
            this.debugPrintPlayersTable(this.allPlayers);
        }

        public debugShowCuratedPlayersTable(): void {
            this.debugPrintPlayersTable(this.unselectedPlayers);
        }

        public debugPrintPlayersTable(players: Shared.INewGamePlayer[]): void {
            // Change "info" to "table" to show as table in browser debugger
            console.info(players.map((p) => {
                return {
                    orderNumber: p.orderNumber,
                    rating: p.rating,
                    name: p.player.fullname
                };
            }));
        }
    }
}