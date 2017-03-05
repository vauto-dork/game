module EnterScores {
    export interface IEnterScoresService {
        datePlayed: Date;
        unselectedPlayers: Shared.INewGamePlayer[];
        state: ScoreFormState;

        createGame(): void;
        addPlayer(data: Shared.INewGamePlayer): void;
    }

    export enum ScoreFormState {
        DateSelect,
        ScoreEntry
    }

    export class EnterScoresService implements IEnterScoresService {
        public static $inject: string[] = ["$q", "apiService", "playerSelectionService", "newPlayerPanelService"];

        private currentState: ScoreFormState;
        private localDatePlayed: Date;

        public get unselectedPlayers(): Shared.INewGamePlayer[] {
            return [];
        }

        public get state(): ScoreFormState {
            return this.currentState;
        }

        public get datePlayed(): Date {
            return this.localDatePlayed;
        }

        public set datePlayed(value: Date) {
            this.localDatePlayed = value;
        }

        constructor() {
            console.info("enter scores service started");
            this.currentState = ScoreFormState.DateSelect;
        }

        public createGame(): void {
            this.currentState = ScoreFormState.ScoreEntry;
        }

        public addPlayer(data: Shared.INewGamePlayer): void {
        }
    }
}