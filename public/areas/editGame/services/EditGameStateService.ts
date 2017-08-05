module EditGame {
    export enum State {
        Init,
        Loading,
        Error,
        Ready,
        Saving,
        Finalizing,
        Updating
    }

    export interface IEditGameStateService {
        showLoading: boolean;
        showError: boolean;
        showScoreForm: boolean;
        disabled: boolean;

        changeState(newState: State): void;
        subscribeStateChange(callback: Function): void;
    }

    export class EditGameStateService extends Shared.PubSubServiceBase implements IEditGameStateService {
        public static $inject: string[] = ["$timeout"];

        public showLoading: boolean = false;
        public showError: boolean = false;
        public showScoreForm: boolean = false;
        public disabled: boolean = false;

        private events = {
            stateChange: "stateChange"
        };

        constructor($timeout: ng.ITimeoutService) {
            super($timeout);
            this.changeState(State.Init);
        }

        public changeState(newState: State): void {
            this.showLoading = (newState === State.Init) ||
                (newState === State.Loading);

            this.showError = newState === State.Error;

            this.showScoreForm = (newState !== State.Init) &&
                (newState !== State.Loading) &&
                (newState !== State.Error);

            this.disabled = (newState === State.Saving) ||
                (newState === State.Updating) ||
                (newState === State.Finalizing) ||
                (newState === State.Init) ||
                (newState === State.Loading);

            this.publish(this.events.stateChange, newState);
        }

        public subscribeStateChange(callback: Function): void {
            this.subscribe(this.events.stateChange, callback);
        }
    }
}