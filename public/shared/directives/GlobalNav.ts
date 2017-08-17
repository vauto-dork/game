module Shared {
    export function GlobalNav(): ng.IComponentOptions {
        return {
			templateUrl: '/shared/directives/GlobalNavTemplate.html',
			controller: GlobalNavController
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
