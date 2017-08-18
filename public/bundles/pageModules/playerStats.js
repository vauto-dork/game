var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.service('playerStatsService', PlayerStats.PlayerStatsService);

DorkModule.controller('DeltaBoxController', PlayerStats.DeltaBoxController);
DorkModule.directive('deltaBox', PlayerStats.DeltaBoxDirective);

DorkModule.controller('PlayerStatsCardController', PlayerStats.PlayerStatsCardController);
DorkModule.directive('playerStatsCard', PlayerStats.PlayerStatsCardDirective);

DorkModule.controller('PlayerStatsController', PlayerStats.PlayerStatsController);
DorkModule.directive('playerStats', PlayerStats.PlayerStatsDirective);

function setPlayerId(value) {
    DorkModule.constant('playerId', value);
}