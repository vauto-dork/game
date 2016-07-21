var Shared;
(function (Shared) {
    function DatePickerDirective() {
        return {
            scope: {
                date: "=",
                showNowButton: "=",
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
            this.datePickerOpened = false;
            this.timePickerOpened = false;
            this.dateOptions = {
                minDate: new Date(2015, 4, 1),
                maxDate: new Date(),
                showWeeks: false,
                startingDay: 0
            };
        }
        Object.defineProperty(DatePickerController.prototype, "prettyDate", {
            get: function () {
                return this.dateTimeService.beautifyDate(this.date, true);
            },
            enumerable: true,
            configurable: true
        });
        DatePickerController.prototype.openDatePicker = function () {
            this.datePickerOpened = !this.datePickerOpened;
        };
        DatePickerController.prototype.openTimePicker = function () {
            this.timePickerOpened = !this.timePickerOpened;
        };
        DatePickerController.prototype.withLeadingZero = function (value) {
            return value < 10 ? "0" + value : "" + value;
        };
        DatePickerController.prototype.useCurrentTime = function () {
            this.date = new Date();
        };
        DatePickerController.$inject = ['dateTimeService'];
        return DatePickerController;
    }());
    Shared.DatePickerController = DatePickerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=DatePickerDirective.js.map