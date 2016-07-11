var Shared;
(function (Shared) {
    function MonthYearPickerDirective() {
        return {
            scope: {
                month: "=",
                year: "=",
                disabled: "=?",
                change: "&"
            },
            templateUrl: '/shared/directives/MonthYearPickerTemplate.html',
            controller: 'MonthYearPickerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.MonthYearPickerDirective = MonthYearPickerDirective;
    var MonthYearPickerController = (function () {
        function MonthYearPickerController($scope, dateTimeService) {
            this.$scope = $scope;
            this.dateTimeService = dateTimeService;
            this.isDisabled = false;
            this.minimumYear = 2015;
            this.disableYear = false;
            this.years = [];
            this.months = [
                { name: 'January', value: 0 },
                { name: 'February', value: 1 },
                { name: 'March', value: 2 },
                { name: 'April', value: 3 },
                { name: 'May', value: 4 },
                { name: 'June', value: 5 },
                { name: 'July', value: 6 },
                { name: 'August', value: 7 },
                { name: 'September', value: 8 },
                { name: 'October', value: 9 },
                { name: 'November', value: 10 },
                { name: 'December', value: 11 }
            ];
            this.init();
        }
        Object.defineProperty(MonthYearPickerController.prototype, "disabled", {
            get: function () {
                return this.isDisabled;
            },
            set: function (value) {
                this.isDisabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonthYearPickerController.prototype, "month", {
            get: function () {
                return this.currentMonth === undefined || this.currentMonth === null
                    ? this.dateTimeService.currentMonthValue()
                    : this.currentMonth;
            },
            set: function (value) {
                this.currentMonth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonthYearPickerController.prototype, "year", {
            get: function () {
                return this.currentYear === undefined || this.currentYear === null
                    ? this.dateTimeService.currentYear()
                    : this.currentYear;
            },
            set: function (value) {
                this.currentYear = value;
            },
            enumerable: true,
            configurable: true
        });
        MonthYearPickerController.prototype.init = function () {
            this.selectedMonth = this.months[this.currentMonth];
            for (var i = this.minimumYear; i <= this.currentYear; i++) {
                var tempYear = { name: i.toString(), value: i };
                this.years.push(tempYear);
                if (i === this.currentYear) {
                    this.selectedYear = tempYear;
                }
            }
            this.disableYear = this.disableYear || this.years.length <= 1;
        };
        ;
        MonthYearPickerController.prototype.updateParams = function () {
            this.month = this.selectedMonth.value;
            this.year = this.selectedYear.value;
            if (this.change !== undefined) {
                this.change();
            }
        };
        ;
        MonthYearPickerController.$inject = ['$scope', 'dateTimeService'];
        return MonthYearPickerController;
    }());
    Shared.MonthYearPickerController = MonthYearPickerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=MonthYearPickerDirective.js.map