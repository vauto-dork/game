var PlayerStats;
(function (PlayerStats) {
    var PlayerStatsService = (function () {
        function PlayerStatsService() {
        }
        return PlayerStatsService;
    }());
    PlayerStats.PlayerStatsService = PlayerStatsService;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    function PlayerStatsDirective() {
        return {
            scope: {},
            templateUrl: "/areas/playerStats/directives/PlayerStatsTemplate.html",
            controller: "PlayerStatsController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    PlayerStats.PlayerStatsDirective = PlayerStatsDirective;
    var PlayerStatsController = (function () {
        function PlayerStatsController() {
        }
        return PlayerStatsController;
    }());
    PlayerStats.PlayerStatsController = PlayerStatsController;
})(PlayerStats || (PlayerStats = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.service('playerStatsService', PlayerStats.PlayerStatsService);

DorkModule.controller('PlayerStatsController', PlayerStats.PlayerStatsController);
DorkModule.directive('playerStats', PlayerStats.PlayerStatsDirective);
//# sourceMappingURL=maps/playerStats.js.map