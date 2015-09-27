var DateTimeFactory = function() {
	var me = this;
	me.currentMonth = new Date().getMonth();
	me.currentYear = new Date().getFullYear();
	
	me.monthNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December"
	];
	
	me.lastMonthValue = (me.currentMonth - 1 < 0) ? 11 : me.currentMonth - 1;
	me.lastMonthYear = (me.currentMonth - 1 < 0) ? me.currentYear - 1 : me.currentYear;
	
	return {
		CurrentYear: function() {
			return me.currentYear;
		},
		CurrentMonthValue: function() {
			return me.currentMonth;
		},
		CurrentMonthName: function() {
			return me.monthNames[me.currentMonth];
		},
		LastMonthYear: function() {
			return me.lastMonthYear;
		},
		LastMonthValue: function() {
			return me.lastMonthValue;
		},
		LastMonthName: function() {
			return me.monthNames[me.lastMonthValue];
		},
		MonthName: function(monthValue) {
			if(monthValue >= 0 && monthValue <= 11) {
				return me.monthNames[monthValue];
			}
			
			return '';
		}
	};
};