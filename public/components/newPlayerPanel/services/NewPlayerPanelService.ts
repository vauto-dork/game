module Components {
    export interface INewPlayerPanelService {
        subscribeFormCancel(callback: Function): void;
        subscribeSavedPlayer(callback: Function): void;
        cancelForm(): void;
        savePlayer(player: Shared.IPlayer): ng.IPromise<void>;
    }

    export class NewPlayerPanelService extends Shared.PubSubServiceBase implements INewPlayerPanelService {
        public static $inject: string[] = ["$timeout", "$q", "apiService"];

        private event = {
            formCancel: "formCancel",
            newPlayerReady: "newPlayerReady"
        };

        constructor(
            $timeout: ng.ITimeoutService,
            private $q: ng.IQService,
            private apiService: Shared.IApiService) {
            super($timeout);
        }

        public subscribeFormCancel(callback: Function): void {
            this.subscribe(this.event.formCancel, callback);
        }

        public subscribeSavedPlayer(callback: Function): void {
            this.subscribe(this.event.newPlayerReady, callback);
        }

        public cancelForm(): void {
            this.publish(this.event.formCancel, null);
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