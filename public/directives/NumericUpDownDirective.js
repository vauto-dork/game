var NumericUpDownDirective = function() {
  return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {                
                if (!window.getSelection().toString()) {
                    try {
                        // Required for mobile Safari
                        this.setSelectionRange(0, this.value.length);
                    }
                    catch(ex){
                        // Supress in Chrome
                    }
                }
            });
            
            element.on('keydown', function (event) {
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
                    // Dash
                    key == 173)
                    return true;

                return false;
            });
        }
    };
};
