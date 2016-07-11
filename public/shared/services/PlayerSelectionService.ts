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
        private players: IPlayer[] = [];
        private selectedPlayersList: INewGamePlayer[] = [];
        private unselectedPlayersList: INewGamePlayer[] = [];
        
        public get selectedPlayers(): INewGamePlayer[] {
            return this.selectedPlayersList;
        }

        public get unselectedPlayers(): INewGamePlayer[] {
            return this.unselectedPlayersList;
        }

        constructor(private $q: ng.IQService, private apiService: IApiService) {

        }
        
        private playerIndex(playerId: string): number {
            return this.players.map(p => { return p._id; }).indexOf(playerId);
        }

        public addPlayer(player: IPlayer): void {
            this.players.push(player);
            this.curateNewPlayerList();
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
            var currentPlayerIds = this.players.map(p => p._id);

            // Get players that are not in the current playlist.
            this.unselectedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });

            // Get players that are in the current playlist.
            this.selectedPlayersList = this.allPlayers.filter(player => {
                return currentPlayerIds.indexOf(player.playerId) >= 0;
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