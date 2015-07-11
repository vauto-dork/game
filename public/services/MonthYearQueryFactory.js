var MonthYearQueryFactory = function ($location) {
	var minimumYear = 2015;
	var sanitizeParam = function(value) {
		if(value === undefined) {
			return undefined;
		}
		
		var parsedValue = parseInt(value, 10);
		return isNaN(parsedValue) ? undefined : parsedValue;
	};
	
    return {
		GetMonthQueryParam: function(month) {
			var queryMonth = sanitizeParam($location.search().month);			
			
			if(queryMonth !== undefined) {
				queryMonth--;
				month = queryMonth > 11
						? 0
						: queryMonth < 0 ? 11 : queryMonth;
			}
			
			return month;
		},
		GetYearQueryParam: function(year) {
			var queryYear = sanitizeParam($location.search().year);
			
			if(queryYear !== undefined) {
				year = queryYear < minimumYear ? minimumYear : queryYear;
			}
			
			return year;
		},
		SaveQueryParams: function(month, year) {
			$location.search('month', month + 1);
			$location.search('year', year);
			$location.replace();
		}
    };
};

MonthYearQueryFactory.$inject = ['$location'];