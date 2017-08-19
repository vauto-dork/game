module Components {
    export interface IDotmService {
        data: Shared.IDotmViewModel;
        
        changeDate(month: number, year: number);
        subscribeDateChange(callback: Function);
    }

    export class DotmService extends Shared.PubSubServiceBase implements IDotmService {
        public static $inject: string[] = ["$timeout", "apiService"];

        private localDotmData: Shared.IDotmViewModel;

        public get data(): Shared.IDotmViewModel {
            return this.localDotmData;
        }

        private events = {
            dateChanged: "dateChanged"
        }

        constructor($timeout: ng.ITimeoutService, private apiService: Shared.IApiService) {
            super($timeout);
        }

        public changeDate(month: number, year: number): void {
            this.getDotm(month, year);
        }

        public subscribeDateChange(callback: Function): void {
            this.subscribe(this.events.dateChanged, callback);
        }

        private getDotm(month: number, year: number) {
			this.apiService.getDotm(month, year).then((data: Shared.IDotmViewModel) => {
                this.localDotmData = data;
                this.publish(this.events.dateChanged, null);
			}, ()=>{
				console.error("Cannot get DOTM.");
			});
		}
    }
}