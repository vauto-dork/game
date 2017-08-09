var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.service('playerStatsService', PlayerStats.PlayerStatsService);

DorkModule.controller('DeltaBoxController', PlayerStats.DeltaBoxController);
DorkModule.directive('deltaBox', PlayerStats.DeltaBoxDirective);

DorkModule.controller('PlayerStatsController', PlayerStats.PlayerStatsController);
DorkModule.directive('playerStats', PlayerStats.PlayerStatsDirective);