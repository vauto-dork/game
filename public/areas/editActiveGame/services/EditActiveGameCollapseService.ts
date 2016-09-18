module EditActiveGame {
    export interface IEditActiveGameCollapseService {
        collapseScoreForm: boolean;
        collapseModifyPlayers: boolean;

        disableScoreForm(): void;
        enableScoreForm(): void;

        disableModifyPlayers(): void;
        enableModifyPlayers(): void;
    }

    export class EditActiveGameCollapseService implements IEditActiveGameCollapseService {
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