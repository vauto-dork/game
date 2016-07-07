module Shared {
    export function PlayerBonusPanelDirective(): ng.IDirective {
        return {
            scope: {
                numPlayers: "="
            },
            templateUrl: '/shared/directives/PlayerBonusPanelTemplate.html',
            controller: 'PlayerBonusPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    
    export class PlayerBonusPanelController {
        public static $inject: string[] = [];

        private numPlayers: number;

        constructor() {
        }
    }
}
