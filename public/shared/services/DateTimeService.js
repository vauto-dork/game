var Shared;
(function (Shared) {
    var DateTimeService = (function () {
        function DateTimeService() {
            this.monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            this.abbrMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                "July", "Aug", "Sept", "Oct", "Nov", "Dec"
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
        DateTimeService.prototype.monthName = function (monthValue, abbreviateMonth) {
            var monthNames = abbreviateMonth ? this.abbrMonthNames : this.monthNames;
            if (monthValue >= 0 && monthValue <= 11) {
                return monthNames[monthValue];
            }
            return '';
        };
        DateTimeService.prototype.beautifyDate = function (date, abbreviateMonth) {
            if (!date) {
                return {
                    month: this.monthName(0, abbreviateMonth),
                    day: 1,
                    year: 1970,
                    hour: 12,
                    minute: 0,
                    ampm: "AM"
                };
            }
            ;
            var hour = date.getHours();
            return {
                month: this.monthName(date.getMonth(), abbreviateMonth),
                day: date.getDate(),
                year: date.getFullYear(),
                hour: hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour),
                minute: date.getMinutes(),
                ampm: hour >= 12 ? "PM" : "AM"
            };
        };
        return DateTimeService;
    })();
    Shared.DateTimeService = DateTimeService;
})(Shared || (Shared = {}));
//# sourceMappingURL=DateTimeService.js.map