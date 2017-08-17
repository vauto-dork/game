module Components {
    export function Dotm(): ng.IComponentOptions {
        return {
			templateUrl: '/components/dotm/directives/DotmTemplate.html',
			controller: DotmController
		};
    }

    export class DotmController {
		public static $inject: string[] = ['dotmService', 'apiService'];
		
		private get dotm(): Shared.IDotmViewModel {
			return this.dotmService.data;
		}

		private get hasUberdorks(): boolean {
			return !this.dotm ? false : this.dotm.uberdorks.length > 0;
		}

        constructor(private dotmService: IDotmService, private apiService: Shared.IApiService) {
        }
    }
}

