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
		var year = req.query.year ? parseInt(req.query.year) : now.getUTCFullYear();
		var month;
		var endMonth;
		if(req.query.month) {
			month = parseInt(req.query.month);
			endMonth = month + 1 > 11 ? 0 : month + 1;
		} else {
			if(year) {
				month = 0;
				endMonth = 11;
			}
		}
		var startDateRange = new Date(year, month, 1);
		var endDateRange = new Date(year, endMonth, 1);
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
