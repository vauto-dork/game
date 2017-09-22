module Shared {
    export function TextInput(): ng.IComponentOptions {
        return {
			bindings: {
				name: "@",
                placeholder: "@",
                value: "=",
                disabled: "=",
                required: "=",
                maxlength: "@",
                showClearBtn: "="
			},
			templateUrl: "/shared/directives/TextInputTemplate.html",
			controller: TextInputController
		};
    }

    export class TextInputController {
        public static $inject: string[] = [];
        
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