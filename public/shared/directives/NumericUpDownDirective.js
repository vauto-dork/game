var Shared;
(function (Shared) {
    function NumericUpDownDirective($window) {
        var _this = this;
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    if (!$window.getSelection().toString()) {
                        try {
                            _this.setSelectionRange(0, _this.value.length);
                        }
                        catch (ex) {
                        }
                    }
                });
                element.on('keyup', function (event) {
                    var key = event.which || event.keyCode;
                    if (!event.shiftKey && !event.altKey && !event.ctrlKey &&
                        key >= 48 && key <= 57 ||
                        key >= 96 && key <= 105 ||
                        key == 8 || key == 9 || key == 13 ||
                        key == 35 || key == 36 ||
                        key == 37 || key == 39 ||
                        key == 38 || key == 40 ||
                        key == 46 || key == 45 ||
                        key == 173 || key == 189 || key == 109)
                        return true;
                    return false;
                });
            }
        };
    }
    Shared.NumericUpDownDirective = NumericUpDownDirective;
})(Shared || (Shared = {}));
//# sourceMappingURL=NumericUpDownDirective.js.map