module Shared {
    export interface IAlertsService {
        alerts: IAlert[];

        clearAlerts(): void;
        closeAlert(index: number): void;
        addAlert(messageType: string, message: string): void;
        
        scrollToTop(): void;
        scrollToBottom(): void
    }

    export interface IAlert {
        type: string;
        msg: string;
    }

    export class AlertsService implements IAlertsService {
        public static $inject: string[] = ['$timeout', '$window'];
        private alertsList: IAlert[] = [];

        public get alerts(): IAlert[] {
            return this.alertsList;
        }

        constructor(private $timeout: ng.ITimeoutService, private $window: ng.IWindowService) {
            
        }

        public closeAlert(index: number): void {
            this.alertsList.splice(index, 1);
        }

        public addAlert(messageType: string, message: string): void {
            this.alertsList.push({ type: messageType, msg: message });
        }

        public clearAlerts(): void {
            this.alertsList = [];
        }

        public scrollToTop(): void {
            this.$timeout(() => {
                this.$window.scrollTo(0, 0);
            });
        }

        public scrollToBottom(): void {
            this.$timeout(() => {
                this.$window.scrollTo(0, 100000);
            });
        }
    }
}