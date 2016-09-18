module Shared {
    export function NumericUpDownDirective($window: ng.IWindowService): ng.IDirective {
        return {
            restrict: 'A',
            link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

                element.on('click', () => {
                    if (!$window.getSelection().toString()) {
                        // Works in all browsers except mobile Safari. SetSelectionRange() is
                        // too much of a bear to get working properly with Angular and Typescript.
                        element.select();
                    }
                });

                element.on('keyup', (event: JQueryEventObject) => {
                    var key = event.which || event.keyCode;

                    if (!event.shiftKey && !event.altKey && !event.ctrlKey &&
                        // numbers  
                        key >= 48 && key <= 57 ||
                        // Numeric keypad
                        key >= 96 && key <= 105 ||
                        // Backspace and Tab and Enter
                        key == 8 || key == 9 || key == 13 ||
                        // Home and End
                        key == 35 || key == 36 ||
                        // left and right arrows
                        key == 37 || key == 39 ||
                        // up and down arrows
                        key == 38 || key == 40 ||
                        // Del and Ins
                        key == 46 || key == 45 ||
                        // Dash and subtract
                        key == 173 || key == 189 || key == 109)
                        return true;

                    return false;
                });
            }
        };
    }
}