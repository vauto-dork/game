var PlayerStats;
(function (PlayerStats) {
    var PlayerStatsService = (function () {
        function PlayerStatsService($location, $q, apiService) {
            this.$location = $location;
            this.$q = $q;
            this.apiService = apiService;
            this.playerId = "";
            this.errorMessageList = [];
            this.getPlayerStats();
        }
        Object.defineProperty(PlayerStatsService.prototype, "playerStats", {
            get: function () {
                return this.localPlayerStats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsService.prototype, "latestGame", {
            get: function () {
                if (this.localPlayerStats) {
                    return this.localPlayerStats.games[0];
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        PlayerStatsService.prototype.getPlayerStats = function () {
            var _this = this;
            var def = this.$q.defer();
            if (this.$location.path() !== undefined || this.$location.path() !== '') {
                this.playerId = this.$location.path();
            }
            this.apiService.getPlayerStats(this.playerId).then(function (playerStats) {
                _this.localPlayerStats = playerStats;
                def.resolve();
            }, function () {
                _this.addErrorMessage('Cannot get active game.');
                def.reject();
            });
            return def.promise;
        };
        PlayerStatsService.prototype.addErrorMessage = function (message, clear) {
            if (clear === void 0) { clear = true; }
            if (clear) {
                this.clearerrorMessageList();
            }
            this.errorMessageList.push(message);
        };
        PlayerStatsService.prototype.clearerrorMessageList = function () {
            this.errorMessageList = [];
        };
        PlayerStatsService.$inject = ["$location", "$q", "apiService"];
        return PlayerStatsService;
    }());
    PlayerStats.PlayerStatsService = PlayerStatsService;
})(PlayerStats || (PlayerStats = {}));

var PlayerStats;
(function (PlayerStats) {
    function DeltaBoxDirective() {
        return {
            scope: {
                value: "=",
                decimal: "@",
                diff: "="
            },
            templateUrl: "/areas/playerStats/directives/DeltaBoxTemplate.html",
            controller: "DeltaBoxController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    PlayerStats.DeltaBoxDirective = DeltaBoxDirective;
    var DeltaBoxController = (function () {
        function DeltaBoxController() {
        }
        Object.defineProperty(DeltaBoxController.prototype, "hasNoValue", {
            get: function () {
                return this.value === null || this.value === undefined;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "hasValue", {
            get: function () {
                return (this.value === 0) || !!this.value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "isDiffPositive", {
            get: function () {
                return this.diff > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "isDiffNegative", {
            get: function () {
                return this.diff < 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "absDiff", {
            get: function () {
                return Math.abs(this.diff);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DeltaBoxController.prototype, "absValue", {
            get: function () {
                return Math.abs(this.value);
            },
            enumerable: true,
            configurable: true
        });
        return DeltaBoxController;
    }());
    PlayerStats.DeltaBoxController = DeltaBoxController;
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
        function PlayerStatsController(playerStatsService) {
            var _this = this;
            this.playerStatsService = playerStatsService;
            this.showLoading = false;
            this.showLoading = true;
            playerStatsService.getPlayerStats().then(function () {
                _this.showLoading = false;
            });
        }
        Object.defineProperty(PlayerStatsController.prototype, "playerStats", {
            get: function () {
                return this.playerStatsService.playerStats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsController.prototype, "rating", {
            get: function () {
                if (!this.playerStatsService.latestGame) {
                    return 0;
                }
                return this.playerStatsService.latestGame.rating;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerStatsController.prototype, "rank", {
            get: function () {
                if (!this.playerStatsService.latestGame) {
                    return 0;
                }
                return this.playerStatsService.latestGame.rank;
            },
            enumerable: true,
            configurable: true
        });
        PlayerStatsController.prototype.rankValue = function (value) {
            return value === 0 ? null : value;
        };
        PlayerStatsController.$inject = ["playerStatsService"];
        return PlayerStatsController;
    }());
    PlayerStats.PlayerStatsController = PlayerStatsController;
})(PlayerStats || (PlayerStats = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.service('playerStatsService', PlayerStats.PlayerStatsService);

DorkModule.controller('DeltaBoxController', PlayerStats.DeltaBoxController);
DorkModule.directive('deltaBox', PlayerStats.DeltaBoxDirective);

DorkModule.controller('PlayerStatsController', PlayerStats.PlayerStatsController);
DorkModule.directive('playerStats', PlayerStats.PlayerStatsDirective);
//# sourceMappingURL=maps/playerStats.js.map