var Shared;
(function (Shared) {
    function DatePickerDirective() {
        return {
            scope: {
                date: "=",
                disabled: "="
            },
            templateUrl: '/shared/directives/DatePickerTemplate.html',
            controller: 'DatePickerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.DatePickerDirective = DatePickerDirective;
    var DatePickerController = (function () {
        function DatePickerController(dateTimeService) {
            this.dateTimeService = dateTimeService;
            this.format = 'MMMM dd, yyyy';
            this.hstep = 1;
            this.mstep = 1;
            this.opened = false;
            this.dateOptions = {
                minDate: new Date(2015, 4, 1),
                showWeeks: false,
                startingDay: 0
            };
        }
        Object.defineProperty(DatePickerController.prototype, "prettyDate", {
            get: function () {
                return this.dateTimeService.beautifyDate(this.date);
            },
            enumerable: true,
            configurable: true
        });
        DatePickerController.prototype.open = function () {
            this.opened = true;
        };
        DatePickerController.prototype.withLeadingZero = function (value) {
            return value < 10 ? "0" + value : "" + value;
        };
        DatePickerController.$inject = ['dateTimeService'];
        return DatePickerController;
    })();
    Shared.DatePickerController = DatePickerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=DatePickerDirective.js.map