var UxControlsModule = angular.module('UxControlsModule', ['ngAnimate', 'ui.bootstrap']);

UxControlsModule.service('dateTimeFactory', DateTimeFactory);

UxControlsModule.factory('monthYearQueryFactory', MonthYearQueryFactory);
UxControlsModule.factory('playerNameFactory', PlayerNameFactory);

UxControlsModule.controller('DatePickerController', DatePickerController);
UxControlsModule.directive('datePicker', DatePickerDirective);

UxControlsModule.controller('MonthYearPickerController', MonthYearPickerController);
UxControlsModule.directive('monthYearPicker', MonthYearPickerDirective);

UxControlsModule.controller('PlayerNametagController', PlayerNametagController);
UxControlsModule.directive('playerNametag', PlayerNametagDirective);

UxControlsModule.controller('PlayerScoretagController', PlayerScoretagController);
UxControlsModule.directive('playerScoretag', PlayerScoretagDirective);

UxControlsModule.controller('GlobalNavController', GlobalNavController);
UxControlsModule.directive('globalNav', GlobalNavDirective);

UxControlsModule.directive('numericUpDown', NumericUpDownDirective);