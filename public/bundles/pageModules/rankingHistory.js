var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'DotmModule', 'RankingsModule']);

DorkModule.controller('RankingHistoryController', DorkHistory.RankingHistoryController);
DorkModule.directive('rankingHistory', DorkHistory.RankingHistoryDirective);