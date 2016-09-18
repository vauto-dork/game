module Components {
    export abstract class NewPlayerPanelBase {
        protected collapsePlayerSelectorPanel: boolean = false;
		protected collapseAddNewPlayerPanel: boolean = true;

        constructor() { }

        protected disablePlayerSelectorPanel(): void {
			this.collapsePlayerSelectorPanel = true;
		}

		protected enablePlayerSelectorPanel(): void {
			this.collapsePlayerSelectorPanel = false;
		}

		protected disableAddNewPlayer(): void {
			this.collapseAddNewPlayerPanel = true;
		}

		protected enableAddNewPlayer(): void {
			this.collapseAddNewPlayerPanel = false;
		}
    }
}