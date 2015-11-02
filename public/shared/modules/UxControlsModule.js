var UxControlsModule = angular.module('UxControlsModule', ['ngAnimate', 'ui.bootstrap']);
UxControlsModule.factory('dateTimeFactory', Shared.DateTimeFactory);
UxControlsModule.factory('monthYearQueryFactory', Shared.MonthYearQueryFactory);
UxControlsModule.factory('playerNameFactory', Shared.PlayerNameFactory);
UxControlsModule.factory('apiFactory', Shared.ApiFactory);
UxControlsModule.controller('DatePickerController', Shared.DatePickerController);
UxControlsModule.directive('datePicker', Shared.DatePickerDirective);
UxControlsModule.controller('MonthYearPickerController', Shared.MonthYearPickerController);
UxControlsModule.directive('monthYearPicker', Shared.MonthYearPickerDirective);
UxControlsModule.controller('PlayerNametagController', Shared.PlayerNametagController);
UxControlsModule.directive('playerNametag', Shared.PlayerNametagDirective);
UxControlsModule.controller('PlayerScoretagController', Shared.PlayerScoretagController);
UxControlsModule.directive('playerScoretag', Shared.PlayerScoretagDirective);
UxControlsModule.controller('GlobalNavController', Shared.GlobalNavController);
UxControlsModule.directive('globalNav', Shared.GlobalNavDirective);
UxControlsModule.directive('numericUpDown', Shared.NumericUpDownDirective);
//# sourceMappingURL=UxControlsModule.js.map