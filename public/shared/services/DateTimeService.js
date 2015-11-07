var Shared;
(function (Shared) {
    var DateTimeService = (function () {
        function DateTimeService() {
            this.monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
        }
        DateTimeService.prototype.currentYear = function () {
            return new Date().getFullYear();
        };
        DateTimeService.prototype.currentMonthValue = function () {
            return new Date().getMonth();
        };
        DateTimeService.prototype.currentMonthName = function () {
            return this.monthNames[this.currentMonthValue()];
        };
        DateTimeService.prototype.lastMonthYear = function () {
            return (this.currentMonthValue() - 1 < 0) ? this.currentYear() - 1 : this.currentYear();
        };
        DateTimeService.prototype.lastMonthValue = function () {
            return (this.currentMonthValue() - 1 < 0) ? 11 : this.currentMonthValue() - 1;
        };
        DateTimeService.prototype.lastMonthName = function () {
            return this.monthNames[this.lastMonthValue()];
        };
        DateTimeService.prototype.monthName = function (monthValue) {
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