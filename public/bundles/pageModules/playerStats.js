var DorkModule = angular.module('DorkModule', ['PlayerStatsModule']);

function setPlayerId(value) {
    DorkModule.constant('playerId', value);
}