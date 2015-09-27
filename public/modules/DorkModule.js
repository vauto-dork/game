var DorkModule = angular.module('DorkModule', ['ngAnimate', 'PlayerNametagModule', 'PlayerScoretagModule', 'DatePickerModule', 'MonthYearPickerModule']);

DorkModule.service('dateTimeFactory', DateTimeFactory);
DorkModule.factory('monthYearQueryFactory', MonthYearQueryFactory);
DorkModule.factory('playerNameFactory', PlayerNameFactory);
DorkModule.directive('numericUpDown', NumericUpDownDirective);