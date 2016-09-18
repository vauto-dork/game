module Shared {
    export function TextInputDirective(): ng.IDirective {
        return {
			scope: {
				name: "@",
                placeholder: "@",
                value: "=",
                disabled: "=",
                required: "=",
                maxlength: "@",
                showClearBtn: "="
			},
			templateUrl: "/shared/directives/TextInputTemplate.html",
			controller: "TextInputController",
			controllerAs: "ctrl",
			bindToController: true
		};
    }

    export class TextInputController {
        private name: string;
        private placeholder: string;
        private value: string;
        private disabled: boolean;
        private required: boolean;
        private maxlength: string;
        private showClearBtn: boolean;

        constructor() {
        }

        private clearInput(): void {
            this.value = "";
        }
    }
}