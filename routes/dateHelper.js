var express = require('express');
var mongoose = require('mongoose');

module.exports = 
{
	/**
	 * Get date ranges from a request object.
	 * @param req Should contain a month and optionally a year. Default is current year.
	 * @returns {*[]} Array containing the start date and end date.
	 */
	getDateRange: function (req) {
		var now = new Date();
		
		// Use these checks since using bang will cause zero to be not defined.
		var monthDefined = req.query.month !== undefined && req.query.month !== null;
		var yearDefined = req.query.year !== undefined && req.query.year !== null;
		
		var month = monthDefined ? parseInt(req.query.month) : now.getMonth();
		var year = yearDefined ? parseInt(req.query.year) : now.getFullYear();	
		
		var isDecember = month + 1 > 11;
		var endMonth = isDecember ? 0 : month + 1;
		var endYear = isDecember ? year + 1 : year;
		
		// If no month requested, then show all for the year.
		if(!monthDefined) {
			month = 0;
			endMonth = 0;
			endYear = year + 1;
		}
		
		var startDateRange = new Date(year, month, 1);
		var endDateRange = new Date(endYear, endMonth, 1);
		return [startDateRange, endDateRange];
	},
	
	/* Gets the month range representing the current month. */
	getCurrentMonthRange: function () {
		var now = new Date();
		var month = now.getMonth();
		var endMonth = month + 1 > 11 ? 0 : month + 1;
		var year = month + 1 > 11 ? now.getFullYear() + 1 : now.getFullYear();
		var startDateRange = new Date(year, month, 1);
		var endDateRange = new Date(year, endMonth, 1);
		return [startDateRange, endDateRange];
	}
}
