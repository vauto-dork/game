var Shared;
(function (Shared) {
    var DateTimeFactory = (function () {
        function DateTimeFactory() {
            this.monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
        }
        DateTimeFactory.prototype.CurrentYear = function () {
            return new Date().getFullYear();
        };
        DateTimeFactory.prototype.CurrentMonthValue = function () {
            return new Date().getMonth();
        };
        DateTimeFactory.prototype.CurrentMonthName = function () {
            return this.monthNames[this.CurrentMonthValue()];
        };
        DateTimeFactory.prototype.LastMonthYear = function () {
            return (this.CurrentMonthValue() - 1 < 0) ? this.CurrentYear() - 1 : this.CurrentYear();
        };
        DateTimeFactory.prototype.LastMonthValue = function () {
            return (this.CurrentMonthValue() - 1 < 0) ? 11 : this.CurrentMonthValue() - 1;
        };
        DateTimeFactory.prototype.LastMonthName = function () {
            return this.monthNames[this.LastMonthValue()];
        };
        DateTimeFactory.prototype.MonthName = function (monthValue) {
            if (monthValue >= 0 && monthValue <= 11) {
                return this.monthNames[monthValue];
            }
            return '';
        };
        return DateTimeFactory;
    })();
    Shared.DateTimeFactory = DateTimeFactory;
})(Shared || (Shared = {}));
//# sourceMappingURL=DateTimeFactory.js.map