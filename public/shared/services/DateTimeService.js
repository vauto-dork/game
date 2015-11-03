var Shared;
(function (Shared) {
    var DateTimeService = (function () {
        function DateTimeService() {
            this.monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
        }
        DateTimeService.prototype.CurrentYear = function () {
            return new Date().getFullYear();
        };
        DateTimeService.prototype.CurrentMonthValue = function () {
            return new Date().getMonth();
        };
        DateTimeService.prototype.CurrentMonthName = function () {
            return this.monthNames[this.CurrentMonthValue()];
        };
        DateTimeService.prototype.LastMonthYear = function () {
            return (this.CurrentMonthValue() - 1 < 0) ? this.CurrentYear() - 1 : this.CurrentYear();
        };
        DateTimeService.prototype.LastMonthValue = function () {
            return (this.CurrentMonthValue() - 1 < 0) ? 11 : this.CurrentMonthValue() - 1;
        };
        DateTimeService.prototype.LastMonthName = function () {
            return this.monthNames[this.LastMonthValue()];
        };
        DateTimeService.prototype.MonthName = function (monthValue) {
            if (monthValue >= 0 && monthValue <= 11) {
                return this.monthNames[monthValue];
            }
            return '';
        };
        return DateTimeService;
    })();
    Shared.DateTimeService = DateTimeService;
})(Shared || (Shared = {}));
//# sourceMappingURL=DateTimeService.js.map