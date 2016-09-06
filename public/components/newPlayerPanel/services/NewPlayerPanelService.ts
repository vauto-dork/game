module Components {
    export interface INewPlayerPanelService {
        subscribeSavedPlayer(callback: Function): void;
        savePlayer(player: Shared.IPlayer): ng.IPromise<void>;
    }

    export class NewPlayerPanelService extends Shared.PubSubServiceBase implements INewPlayerPanelService {
        public static $inject: string[] = ["$timeout", "$q", "apiService"];

        private event = {
            newPlayerReady: "newPlayerReady"
        };

        constructor($timeout: ng.ITimeoutService,
            private $q: ng.IQService,
            private apiService: Shared.IApiService) {
            
            super($timeout);
        }

        public subscribeSavedPlayer(callback: Function): void {
            this.subscribe(this.event.newPlayerReady, callback);
        }

        public savePlayer(player: Shared.IPlayer): ng.IPromise<void> {
			return this.apiService.saveNewPlayer(player).then((data: Shared.IPlayer) => {
                this.publish(this.event.newPlayerReady, data);
                this.$q.resolve();
			}, (data) => {
				this.$q.reject(data);
			});
		}
    }
}