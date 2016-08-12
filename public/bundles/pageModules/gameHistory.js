var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'GameCardModule']);

DorkModule.controller('GameHistoryController', DorkHistory.GameHistoryController);
DorkModule.directive('gameHistory', DorkHistory.GameHistoryDirective);