module AdminPanel {
    export function AdminPanel(): ng.IComponentOptions {
        return {
            templateUrl: "/areas/adminPanel/directives/AdminPanelTemplate.html",
            controller: AdminPanelController
        };
    }

    export class AdminPanelController {
        public static $inject: string[] = [];
        
        constructor() {
            
        }
    }
}