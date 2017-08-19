module EditGame {
    import EditGameType = Shared.EditGameType;
    
    export function RevertFinalize(): ng.IComponentOptions {
        return {
            templateUrl: '/areas/editGame/directives/RevertFinalizeTemplate.html',
            controller: RevertFinalizeController
        };
    }

    export class RevertFinalizeController {
        public static $inject: string[] = ["editGameStateService", "editGameService"];

        private get disabled(): boolean {
            return this.stateService.disabled;
        }

        private get numPlayers(): number {
            return this.editGameService.players.length;
        }

        private get isFinalizedGame(): boolean {
            return this.editGameService.gameType === EditGameType.FinalizedGame;
        }

        constructor(private stateService: IEditGameStateService, private editGameService: IEditGameService) {
            
        }

        private save() {
            this.stateService.changeState(State.Saving);
        }

        private revert() {
            this.stateService.changeState(State.Loading);
        }

        private finalize() {
            this.stateService.changeState(State.Finalizing);
        }

        private update() {
            this.stateService.changeState(State.Updating);
        }
    }
}