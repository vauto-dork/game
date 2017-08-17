module Components {
    export function PlayerBonusPanel(): ng.IComponentOptions {
        return {
            bindings: {
                numPlayers: "="
            },
            templateUrl: '/components/playerBonusPanel/directives/PlayerBonusPanelTemplate.html',
            controller: PlayerBonusPanelController
        };
    }
    
    export class PlayerBonusPanelController {
        public static $inject: string[] = [];

        private numPlayers: number;

        constructor() {
        }
    }
}
