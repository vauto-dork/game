var Dotm;
(function (Dotm) {
    function DotmDirective() {
        return {
            scope: {
                month: "=",
                year: "="
            },
            templateUrl: '/areas/dotm/directives/DotmTemplate.html',
            controller: 'DotmController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Dotm.DotmDirective = DotmDirective;
    var DotmController = (function () {
        function DotmController($scope, apiService) {
            var _this = this;
            this.$scope = $scope;
            this.apiService = apiService;
            this.hasUberdorks = false;
            this.getDotm();
            $scope.$watchGroup([function () { return _this.month; }, function () { return _this.year; }], function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    _this.getDotm();
                }
            });
        }
        DotmController.prototype.getDotm = function () {
            var _this = this;
            this.hasUberdorks = false;
            this.apiService.getDotm(this.month, this.year).then(function (data) {
                _this.dotm = data;
                _this.hasUberdorks = data.uberdorks.length > 0;
            }, function () {
                console.error("Cannot get DOTM.");
            });
        };
        DotmController.$inject = ['$scope', 'apiService'];
        return DotmController;
    }());
    Dotm.DotmController = DotmController;
})(Dotm || (Dotm = {}));

var DotmModule = angular.module('DotmModule', []);
DotmModule.controller('DotmController', Dotm.DotmController);
DotmModule.directive('dotm', Dotm.DotmDirective);

var Rankings;
(function (Rankings) {
    var PlayerSelection;
    (function (PlayerSelection) {
        PlayerSelection[PlayerSelection["All"] = 0] = "All";
        PlayerSelection[PlayerSelection["OverTen"] = 1] = "OverTen";
        PlayerSelection[PlayerSelection["UnderTen"] = 2] = "UnderTen";
    })(PlayerSelection || (PlayerSelection = {}));
    ;
    var RankingsService = (function () {
        function RankingsService($q, apiService) {
            this.$q = $q;
            this.apiService = apiService;
            this.cachedPlayers = [];
        }
        RankingsService.prototype.getRankings = function (month, year, hideUnranked) {
            var _this = this;
            var def = this.$q.defer();
            this.apiService.getRankedPlayers(month, year, hideUnranked).then(function (data) {
                _this.cachedPlayers = data;
                def.resolve();
            }, function () {
                def.reject();
            });
            return def.promise;
        };
        RankingsService.prototype.getAllPlayers = function () {
            return this.getPlayers(PlayerSelection.All);
        };
        RankingsService.prototype.getPlayersOverTenGames = function () {
            return this.getPlayers(PlayerSelection.OverTen);
        };
        RankingsService.prototype.getPlayersUnderTenGames = function () {
            return this.getPlayers(PlayerSelection.UnderTen);
        };
        RankingsService.prototype.getPlayers = function (playerSelection) {
            switch (playerSelection) {
                case PlayerSelection.UnderTen:
                    var underTen = this.cachedPlayers.filter(function (player) {
                        return player.gamesPlayed < 10;
                    });
                    return this.assignRankValue(underTen);
                case PlayerSelection.OverTen:
                    var overTen = this.cachedPlayers.filter(function (player) {
                        return player.gamesPlayed >= 10;
                    });
                    return this.assignRankValue(overTen);
                default:
                    return this.assignRankValue(this.cachedPlayers);
            }
        };
        ;
        RankingsService.prototype.assignRankValue = function (selectedPlayers) {
            var counter = 0;
            selectedPlayers.forEach(function (player, index) {
                if (!player.gamesPlayed) {
                    player.rank = 0;
                }
                else if (index > 0 && player.rating === selectedPlayers[index - 1].rating) {
                    player.rank = counter;
                }
                else {
                    player.rank = ++counter;
                }
            });
            return selectedPlayers;
        };
        RankingsService.$inject = ['$q', 'apiService'];
        return RankingsService;
    }());
    Rankings.RankingsService = RankingsService;
})(Rankings || (Rankings = {}));

var Rankings;
(function (Rankings) {
    function RankingsCardDirective() {
        return {
            scope: {
                player: "="
            },
            templateUrl: '/areas/rankings/directives/RankingsCardTemplate.html',
            controller: 'RankingsCardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Rankings.RankingsCardDirective = RankingsCardDirective;
    var RankingsCardController = (function () {
        function RankingsCardController(monthYearQueryService) {
            var _this = this;
            this.monthYearQueryService = monthYearQueryService;
            this.playerStatsUrl = "";
            monthYearQueryService.subscribeDateChange(function (event, date) {
                _this.appendQueryParams("" + date.getVisibleQueryString());
            });
            var date = monthYearQueryService.getQueryParams();
            this.appendQueryParams(!date ? "" : "" + date.getVisibleQueryString());
        }
        Object.defineProperty(RankingsCardController.prototype, "playerStatsBaseUrl", {
            get: function () {
                return "/playerStats/" + this.player.player.urlId;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(RankingsCardController.prototype, "hasPlayedGames", {
            get: function () {
                return this.player.gamesPlayed > 0;
            },
            enumerable: true,
            configurable: true
        });
        RankingsCardController.prototype.appendQueryParams = function (value) {
            this.playerStatsUrl = "" + this.playerStatsBaseUrl + value;
        };
        RankingsCardController.$inject = ["monthYearQueryService"];
        return RankingsCardController;
    }());
    Rankings.RankingsCardController = RankingsCardController;
})(Rankings || (Rankings = {}));

var Rankings;
(function (Rankings) {
    function RankingsDirective() {
        return {
            scope: {
                month: "=",
                year: "=",
                hideUnranked: "="
            },
            templateUrl: '/areas/rankings/directives/RankingsTemplate.html',
            controller: 'RankingsController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Rankings.RankingsDirective = RankingsDirective;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["Loaded"] = 1] = "Loaded";
        State[State["Error"] = 2] = "Error";
        State[State["NoRankings"] = 3] = "NoRankings";
    })(State || (State = {}));
    ;
    var RankingsController = (function () {
        function RankingsController($scope, rankingsService) {
            var _this = this;
            this.$scope = $scope;
            this.rankingsService = rankingsService;
            this.showLoading = true;
            this.showRankings = false;
            this.showUnrankedPlayers = false;
            this.showUnrankBtn = false;
            this.showErrorMessage = false;
            this.showNoRankingsMessage = false;
            this.players = [];
            this.playersUnderTen = [];
            this.numberNoGames = 0;
            $scope.$watchGroup([function () { return _this.month; }, function () { return _this.year; }], function (newValue, oldValue) {
                if ((newValue !== oldValue)) {
                    _this.changeState(State.Loading);
                }
            });
            this.changeState(State.Loading);
        }
        RankingsController.prototype.changeState = function (newState) {
            this.showLoading = newState === State.Loading;
            this.showRankings = newState === State.Loaded;
            this.showUnrankBtn = newState === State.Loaded && this.numberNoGames > 0;
            this.showErrorMessage = newState === State.Error;
            this.showNoRankingsMessage = newState === State.NoRankings;
            switch (newState) {
                case State.Loading:
                    this.getRankings();
                    break;
            }
        };
        RankingsController.prototype.getRankings = function () {
            var _this = this;
            this.rankingsService.getRankings(this.month, this.year, this.hideUnranked)
                .then(this.loadingSuccess.bind(this), function (data) {
                _this.changeState(State.Error);
                console.error(data);
            });
        };
        RankingsController.prototype.loadingSuccess = function () {
            this.players = this.rankingsService.getPlayersOverTenGames();
            this.playersUnderTen = this.rankingsService.getPlayersUnderTenGames();
            if (this.playersUnderTen.some(function (elem) { return elem.gamesPlayed > 0; })) {
                this.numberNoGames = this.playersUnderTen.filter(function (element) { return element.gamesPlayed <= 0; }).length;
                this.changeState(State.Loaded);
            }
            else {
                this.changeState(State.NoRankings);
            }
        };
        RankingsController.prototype.hasNoRank = function (player) {
            if (player.gamesPlayed > 0) {
                return '';
            }
            if (!this.showUnrankedPlayers) {
                return 'hidden';
            }
            return 'ranking-no-rank';
        };
        RankingsController.prototype.toggleUnrankedPlayers = function () {
            this.showUnrankedPlayers = !this.showUnrankedPlayers;
        };
        RankingsController.$inject = ['$scope', 'rankingsService'];
        return RankingsController;
    }());
    Rankings.RankingsController = RankingsController;
})(Rankings || (Rankings = {}));

var RankingsModule = angular.module('RankingsModule', []);
RankingsModule.service('rankingsService', Rankings.RankingsService);
RankingsModule.controller('RankingsCardController', Rankings.RankingsCardController);
RankingsModule.directive('rankingsCard', Rankings.RankingsCardDirective);
RankingsModule.controller('RankingsController', Rankings.RankingsController);
RankingsModule.directive('rankings', Rankings.RankingsDirective);

var DorkHistory;
(function (DorkHistory) {
    function RankingHistoryDirective() {
        return {
            scope: {},
            templateUrl: '/areas/history/directives/RankingHistoryTemplate.html',
            controller: 'RankingHistoryController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    DorkHistory.RankingHistoryDirective = RankingHistoryDirective;
    var State;
    (function (State) {
        State[State["Init"] = 0] = "Init";
        State[State["Ready"] = 1] = "Ready";
        State[State["Change"] = 2] = "Change";
    })(State || (State = {}));
    ;
    var RankingHistoryController = (function () {
        function RankingHistoryController($timeout, monthYearQueryService, dateTimeService) {
            this.$timeout = $timeout;
            this.monthYearQueryService = monthYearQueryService;
            this.dateTimeService = dateTimeService;
            this.month = dateTimeService.lastMonthValue();
            this.year = dateTimeService.lastMonthYear();
            this.changeState(State.Init);
        }
        RankingHistoryController.prototype.changeState = function (newState) {
            var _this = this;
            switch (newState) {
                case State.Init:
                    this.$timeout(function () {
                        _this.month = _this.monthYearQueryService.getMonthQueryParam(_this.month);
                        _this.year = _this.monthYearQueryService.getYearQueryParam(_this.year);
                        _this.monthYearQueryService.saveQueryParams(_this.month, _this.year);
                    }, 0);
                    this.changeState(State.Ready);
                    break;
                case State.Change:
                    this.$timeout(function () {
                        _this.monthYearQueryService.saveQueryParams(_this.month, _this.year);
                    }, 0);
                    this.changeState(State.Ready);
                    break;
            }
        };
        RankingHistoryController.prototype.updateQueryParams = function () {
            this.changeState(State.Change);
        };
        RankingHistoryController.$inject = ['$timeout', 'monthYearQueryService', 'dateTimeService'];
        return RankingHistoryController;
    }());
    DorkHistory.RankingHistoryController = RankingHistoryController;
})(DorkHistory || (DorkHistory = {}));

var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'DotmModule', 'RankingsModule']);

DorkModule.controller('RankingHistoryController', DorkHistory.RankingHistoryController);
DorkModule.directive('rankingHistory', DorkHistory.RankingHistoryDirective);
//# sourceMappingURL=maps/rankingHistory.js.map