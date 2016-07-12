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
        function DatePickerController() {
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
        DatePickerController.prototype.open = function () {
            this.opened = true;
        };
        DatePickerController.$inject = [];
        return DatePickerController;
    }());
    Shared.DatePickerController = DatePickerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=DatePickerDirective.js.map