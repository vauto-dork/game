module EditGame {
    export interface IEditGameCollapseService {
        collapseScoreForm: boolean;
        collapseModifyPlayers: boolean;

        disableScoreForm(): void;
        enableScoreForm(): void;

        disableModifyPlayers(): void;
        enableModifyPlayers(): void;
    }

    export class EditGameCollapseService implements IEditGameCollapseService {
        public collapseScoreForm: boolean = false;
        public collapseModifyPlayers: boolean = true;

        constructor() { }

        public disableScoreForm(): void {
            this.collapseScoreForm = true;
        }

        public enableScoreForm(): void {
            this.collapseScoreForm = false;
        }

        public disableModifyPlayers(): void {
            this.collapseModifyPlayers = true;
        }

        public enableModifyPlayers(): void {
            this.collapseModifyPlayers = false;
        }
    }
}