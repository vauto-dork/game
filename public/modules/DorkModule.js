var DorkModule = angular.module('DorkModule', ['PlayerNametagModule', 'PlayerScoretagModule', 'DatePickerModule']);

DorkModule.factory('playerNameFactory', PlayerNameFactory);