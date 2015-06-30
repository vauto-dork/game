var DatePickerModule = angular.module('DatePickerModule', ['ui.bootstrap']);

DatePickerModule.controller('DatePickerController', DatePickerController);
DatePickerModule.directive('datePicker', DatePickerDirective);