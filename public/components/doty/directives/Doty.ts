module Components {
    export function Doty(): ng.IComponentOptions {
        return {
			templateUrl: '/components/doty/directives/DotyTemplate.html',
			controller: DotyController
		};
    }

    export class DotyController {
		public static $inject: string[] = ['dotmService', 'apiService'];
		
		private get doty(): Shared.IDotmViewModel {
			return this.dotmService.data;
		}

		private get hasUberdorks(): boolean {
			return !this.doty ? false : this.doty.uberdorks.length > 0;
		}

        constructor(private dotmService: IDotmService, private apiService: Shared.IApiService) {
        }
    }
}

