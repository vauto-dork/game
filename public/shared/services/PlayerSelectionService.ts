module Shared {
    export interface IPlayerSelectionService {
        selectedPlayers: INewGamePlayer[];
        unselectedPlayers: INewGamePlayer[];

        reset(): void;
        getPlayers(): ng.IPromise<INewGame>;
        addPlayer(player: IPlayer): void;
        removePlayer(player: IPlayer): void;
        curateNewPlayerList(): void;

        debugShowAllPlayersTable(): void;
        debugShowCuratedPlayersTable(): void;
        debugPrintPlayersTable(players: INewGamePlayer[]): void;
    }

    export class PlayerSelectionService implements IPlayerSelectionService {
        public static $inject: string[] = ['$q', 'apiService'];

        private allPlayers: INewGamePlayer[] = [];
        private players: INewGamePlayer[] = [];
        private unselectedPlayersList: INewGamePlayer[] = [];
        
        public get selectedPlayers(): INewGamePlayer[] {
            return this.players;
        }

        public get unselectedPlayers(): INewGamePlayer[] {
            return this.unselectedPlayersList;
        }

        constructor(private $q: ng.IQService, private apiService: IApiService) {

        }
        
        private playerIndex(playerId: string): number {
            return this.players.map(p => { return p.playerId; }).indexOf(playerId);
        }

        public addPlayer(player: IPlayer): void {
            var found = this.allPlayers.filter(p => { return p.playerId === player._id });

            if (found.length === 1) {
                this.players.push(found[0]);
                this.curateNewPlayerList();
            } else {
                console.error("Player not found.", player);
            }
        }

        public removePlayer(player: IPlayer): void {
            var index = this.playerIndex(player._id);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        }

        public getPlayers(): ng.IPromise<INewGame> {
            var def = this.$q.defer<INewGame>();

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

        public debugPrintPlayersTable(players: INewGamePlayer[]): void {
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