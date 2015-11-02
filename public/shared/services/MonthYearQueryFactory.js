var Shared;
(function (Shared) {
    var MonthYearQueryFactory = (function () {
        function MonthYearQueryFactory($location) {
            this.$location = $location;
            this.minimumYear = 2015;
        }
        MonthYearQueryFactory.prototype.sanitizeParam = function (value) {
            if (value === undefined) {
                return undefined;
            }
            var parsedValue = parseInt(value, 10);
            return isNaN(parsedValue) ? undefined : parsedValue;
        };
        ;
        MonthYearQueryFactory.prototype.GetMonthQueryParam = function (month) {
            var queryMonth = this.sanitizeParam(this.$location.search().month);
            if (queryMonth !== undefined) {
                queryMonth--;
                month = queryMonth > 11
                    ? 0
                    : queryMonth < 0 ? 11 : queryMonth;
            }
            return month;
        };
        MonthYearQueryFactory.prototype.GetYearQueryParam = function (year) {
            var queryYear = this.sanitizeParam(this.$location.search().year);
            if (queryYear !== undefined) {
                year = queryYear < this.minimumYear ? this.minimumYear : queryYear;
            }
            return year;
        };
        MonthYearQueryFactory.prototype.SaveQueryParams = function (month, year) {
            this.$location.search('month', month + 1);
            this.$location.search('year', year);
            this.$location.replace();
        };
        MonthYearQueryFactory.$inject = ['$location'];
        return MonthYearQueryFactory;
    })();
    Shared.MonthYearQueryFactory = MonthYearQueryFactory;
})(Shared || (Shared = {}));
//# sourceMappingURL=MonthYearQueryFactory.js.map