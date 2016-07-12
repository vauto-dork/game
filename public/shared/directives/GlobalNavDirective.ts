module Shared {
    export function GlobalNavDirective(): ng.IDirective {
        return {
			scope: {
	
			},
			templateUrl: '/shared/directives/GlobalNavTemplate.html',
			controller: 'GlobalNavController',
			controllerAs: 'ctrl',
			bindToController: true
		};
    }

    export class GlobalNavController {
        public static $inject: string[] = [];
		
		private sidebarOpen: boolean = false;

        constructor() {
        }
		
		private closeSidebar(): void {
			if(this.sidebarOpen){
				this.sidebarOpen = false;
			}
		}
    }
}
