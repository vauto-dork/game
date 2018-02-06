module Components {
    export function Doty(): ng.IComponentOptions {
        return {
			templateUrl: '/components/doty/directives/DotyTemplate.html',
			controller: DotyController
		};
    }

    export class DotyController {
		public static $inject: string[] = ['dotyService', 'apiService'];
        
        private get year(): number {
            return !this.data ? null : this.data.year;
        }
        
		private get data(): Shared.IDotyViewModel {
			return this.dotyService.data;
        }

		private get hasUberdorks(): boolean {
			return !this.data ? false : !!this.data.doty;
		}

        constructor(private dotyService: IDotyService, private apiService: Shared.IApiService) {
        }
    }
}

