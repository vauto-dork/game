var Shared;
(function (Shared) {
    var MonthYearQueryService = (function () {
        function MonthYearQueryService($location) {
            this.$location = $location;
            this.minimumYear = 2015;
        }
        MonthYearQueryService.prototype.SanitizeParam = function (value) {
            if (value === undefined) {
                return undefined;
            }
            var parsedValue = parseInt(value, 10);
            return isNaN(parsedValue) ? undefined : parsedValue;
        };
        ;
        MonthYearQueryService.prototype.getMonthQueryParam = function (month) {
            var queryMonth = this.SanitizeParam(this.$location.search().month);
            if (queryMonth !== undefined) {
                queryMonth--;
                month = queryMonth > 11
                    ? 0
                    : queryMonth < 0 ? 11 : queryMonth;
            }
            return month;
        };
        MonthYearQueryService.prototype.getYearQueryParam = function (year) {
            var queryYear = this.SanitizeParam(this.$location.search().year);
            if (queryYear !== undefined) {
                year = queryYear < this.minimumYear ? this.minimumYear : queryYear;
            }
            return year;
        };
        MonthYearQueryService.prototype.saveQueryParams = function (month, year) {
            this.$location.search('month', month + 1);
            this.$location.search('year', year);
            this.$location.replace();
        };
        MonthYearQueryService.$inject = ['$location'];
        return MonthYearQueryService;
    }());
    Shared.MonthYearQueryService = MonthYearQueryService;
})(Shared || (Shared = {}));
//# sourceMappingURL=MonthYearQueryService.js.map