module EnterScores {
    export interface IEnterScoresService {
        datePlayed: Date;
        state: ScoreFormState;

        createGame(): void;
    }

    export enum ScoreFormState {
        DateSelect,
        ScoreEntry
    }

    export class EnterScoresService implements IEnterScoresService {
        public static $inject: string[] = [];

        private currentState: ScoreFormState;
        private localDatePlayed: Date;

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
    }
}