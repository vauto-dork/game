module Shared {
    var UxControlsModule = angular.module('UxControlsModule', ['ngAnimate', 'ui.bootstrap']);

    UxControlsModule.service('localStorageService', LocalStorageService);
    UxControlsModule.service('dateTimeService', DateTimeService);
    UxControlsModule.service('monthYearQueryService', MonthYearQueryService);
    UxControlsModule.service('apiService', ApiService);

    UxControlsModule.component('textInput', TextInput());
    UxControlsModule.component('loadSpinner', LoadSpinner());
    UxControlsModule.component('datePicker', DatePicker());
    UxControlsModule.component('monthYearPicker', MonthYearPicker());
    UxControlsModule.component('playerNametag', PlayerNametag());
    UxControlsModule.component('playerScoretag', PlayerScoretag());
    UxControlsModule.component('globalNav', GlobalNav());

    UxControlsModule.directive('numericUpDown', NumericUpDownDirective);
}