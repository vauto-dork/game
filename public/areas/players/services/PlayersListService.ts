module Players {
    export interface IPlayersListService {
        players: Shared.IPlayer[];

        ready(): ng.IPromise<void>;
        loadPlayers(): ng.IPromise<void>;
        savePlayer(player: Shared.IPlayer, notify: boolean): ng.IPromise<void>;
        cancelEdit(): void;
        openEdit(): void;
        subscribeEditOpen(callback: Function): void;
        subscribeEditSave(callback: Function): void;
        subscribeEditCancel(callback: Function): void;
    }

    export class PlayersListService extends Shared.PubSubServiceBase implements IPlayersListService {
        public static $inject: string[] = ['$timeout', '$q', 'apiService', 'playerSelectionService'];

        private playerLoadPromise: ng.IPromise<void>;
        private allPlayers: Shared.IPlayer[];
        private selPlayer: Shared.IPlayer;

        private event = {
            editOpen: "editOpen",
            editCancel: "editCancel",
            editSave: "editSave"
        }

        public get players(): Shared.IPlayer[] {
            return this.allPlayers;
        }

        constructor(
            $timeout: ng.ITimeoutService,
            private $q: ng.IQService,
            private apiService: Shared.IApiService,
            private playerSelectionService: Components.IPlayerSelectionService) {
            super($timeout);
            this.playerLoadPromise = this.loadPlayers();
        }

        public subscribeEditOpen(callback: Function): void {
            this.subscribe(this.event.editOpen, callback);
        }

        public subscribeEditSave(callback: Function): void {
            this.subscribe(this.event.editSave, callback);
        }

        public subscribeEditCancel(callback: Function): void {
            this.subscribe(this.event.editCancel, callback);
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

        public savePlayer(player: Shared.IPlayer, notify: boolean): ng.IPromise<void> {
			return this.apiService.saveExistingPlayer(player).then(() => {
                if(notify) {
                    this.publish(this.event.editSave, null);
                }
				this.$q.resolve();
			}, (data: string) => {
				this.$q.reject(data);
			});
		}

        public cancelEdit(): void {
            this.publish(this.event.editCancel, null);
        }

        public openEdit(): void {
            this.publish(this.event.editOpen, null);
        }
    }
}