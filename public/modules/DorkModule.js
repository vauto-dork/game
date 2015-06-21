var DorkModule = angular.module('DorkModule', ['PlayerNametagModule', 'PlayerScoretagModule', 'DatePickerModule']);

DorkModule.factory('playerNameFactory', PlayerNameFactory);
DorkModule.directive('numericUpDown', NumericUpDownDirective);