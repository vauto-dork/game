module DorkOfTheYear {
    export interface IDotyService {
        data: Shared.IDotyViewModel;
        
        changeDate(year: number);
        subscribeDateChange(callback: Function);
    }

    export class DotyService extends Shared.PubSubServiceBase implements IDotyService {
        public static $inject: string[] = ["$timeout", "apiService"];

        private localDotyData: Shared.IDotyViewModel;

        public get data(): Shared.IDotyViewModel {
            return this.localDotyData;
        }

        private events = {
            dateChanged: "dateChanged"
        }

        constructor($timeout: ng.ITimeoutService, private apiService: Shared.IApiService) {
            super($timeout);
        }

        public changeDate(year: number): void {
            this.getDoty(year);
        }

        public subscribeDateChange(callback: Function): void {
            this.subscribe(this.events.dateChanged, callback);
        }

        private getDoty(year: number) {
			this.apiService.getDoty(year).then((data: Shared.IDotyViewModel) => {
                this.localDotyData = data;
                this.publish(this.events.dateChanged, null);
			}, ()=>{
				console.error("Cannot get DOTY.");
			});
		}
    }
}