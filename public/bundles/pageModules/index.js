var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'DotmModule', 'RankingsModule']);

DorkModule.controller('LeaderboardController', Rankings.LeaderboardController);
DorkModule.directive('leaderboard', Rankings.LeaderboardDirective);