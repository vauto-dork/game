module EnterScores {
    export interface IEnterScoresService {
        
    }

    export class EnterScoresService implements IEnterScoresService {
        public static $inject: string[] = [];

        constructor() {
            console.info("enter scores service started");
        }
    }
}