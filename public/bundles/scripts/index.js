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
    function RankingsCard() {
        return {
            bindings: {
                player: "="
            },
            templateUrl: '/components/rankings/directives/RankingsCardTemplate.html',
            controller: RankingsCardController
        };
    }
    Rankings.RankingsCard = RankingsCard;
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
    function RankingsPanel() {
        return {
            bindings: {
                month: "=",
                year: "=",
                hideUnranked: "="
            },
            templateUrl: '/components/rankings/directives/RankingsPanelTemplate.html',
            controller: RankingsPanelController
        };
    }
    Rankings.RankingsPanel = RankingsPanel;
    var State;
    (function (State) {
        State[State["Loading"] = 0] = "Loading";
        State[State["Loaded"] = 1] = "Loaded";
        State[State["Error"] = 2] = "Error";
        State[State["NoRankings"] = 3] = "NoRankings";
    })(State || (State = {}));
    ;
    var RankingsPanelController = (function () {
        function RankingsPanelController($scope, rankingsService) {
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
        RankingsPanelController.prototype.changeState = function (newState) {
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
        RankingsPanelController.prototype.getRankings = function () {
            var _this = this;
            this.rankingsService.getRankings(this.month, this.year, this.hideUnranked)
                .then(this.loadingSuccess.bind(this), function (data) {
                _this.changeState(State.Error);
                console.error(data);
            });
        };
        RankingsPanelController.prototype.loadingSuccess = function () {
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
        RankingsPanelController.prototype.hasNoRank = function (player) {
            if (player.gamesPlayed > 0) {
                return '';
            }
            if (!this.showUnrankedPlayers) {
                return 'hidden';
            }
            return 'ranking-no-rank';
        };
        RankingsPanelController.prototype.toggleUnrankedPlayers = function () {
            this.showUnrankedPlayers = !this.showUnrankedPlayers;
        };
        RankingsPanelController.$inject = ['$scope', 'rankingsService'];
        return RankingsPanelController;
    }());
    Rankings.RankingsPanelController = RankingsPanelController;
})(Rankings || (Rankings = {}));

var Rankings;
(function (Rankings) {
    var RankingsModule = angular.module('RankingsModule', []);
    RankingsModule.service('rankingsService', Rankings.RankingsService);
    RankingsModule.component('rankingsCard', Rankings.RankingsCard());
    RankingsModule.component('rankingsPanel', Rankings.RankingsPanel());
})(Rankings || (Rankings = {}));

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Components;
(function (Components) {
    var DotmService = (function (_super) {
        __extends(DotmService, _super);
        function DotmService($timeout, apiService) {
            var _this = _super.call(this, $timeout) || this;
            _this.apiService = apiService;
            _this.events = {
                dateChanged: "dateChanged"
            };
            return _this;
        }
        Object.defineProperty(DotmService.prototype, "data", {
            get: function () {
                return this.localDotmData;
            },
            enumerable: true,
            configurable: true
        });
        DotmService.prototype.changeDate = function (month, year) {
            this.getDotm(month, year);
        };
        DotmService.prototype.subscribeDateChange = function (callback) {
            this.subscribe(this.events.dateChanged, callback);
        };
        DotmService.prototype.getDotm = function (month, year) {
            var _this = this;
            this.apiService.getDotm(month, year).then(function (data) {
                _this.localDotmData = data;
                _this.publish(_this.events.dateChanged, null);
            }, function () {
                console.error("Cannot get DOTM.");
            });
        };
        DotmService.$inject = ["$timeout", "apiService"];
        return DotmService;
    }(Shared.PubSubServiceBase));
    Components.DotmService = DotmService;
})(Components || (Components = {}));

var Components;
(function (Components) {
    function Dotm() {
        return {
            templateUrl: '/components/dotm/directives/DotmTemplate.html',
            controller: DotmController
        };
    }
    Components.Dotm = Dotm;
    var DotmController = (function () {
        function DotmController(dotmService, apiService) {
            this.dotmService = dotmService;
            this.apiService = apiService;
        }
        Object.defineProperty(DotmController.prototype, "dotm", {
            get: function () {
                return this.dotmService.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DotmController.prototype, "hasUberdorks", {
            get: function () {
                return !this.dotm ? false : this.dotm.uberdorks.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        DotmController.$inject = ['dotmService', 'apiService'];
        return DotmController;
    }());
    Components.DotmController = DotmController;
})(Components || (Components = {}));

var Components;
(function (Components) {
    var DotmModule = angular.module('DotmModule', []);
    DotmModule.service('dotmService', Components.DotmService);
    DotmModule.component('dotm', Components.Dotm());
})(Components || (Components = {}));

var Leaderboard;
(function (Leaderboard_1) {
    function Leaderboard() {
        return {
            templateUrl: '/areas/leaderboard/directives/LeaderboardTemplate.html',
            controller: LeaderboardController
        };
    }
    Leaderboard_1.Leaderboard = Leaderboard;
    var LeaderboardController = (function () {
        function LeaderboardController(dateTimeService, dotmService, apiService) {
            this.dateTimeService = dateTimeService;
            this.dotmService = dotmService;
            this.apiService = apiService;
            this.noGamesThisMonth = false;
            this.currentMonth = dateTimeService.currentMonthValue();
            this.currentYear = dateTimeService.currentYear();
            this.lastMonth = dateTimeService.lastMonthValue();
            this.lastMonthYear = dateTimeService.lastMonthYear();
            this.dotmService.changeDate(this.lastMonth, this.lastMonthYear);
            this.getLastPlayedGame();
        }
        LeaderboardController.prototype.getLastPlayedGame = function () {
            var _this = this;
            this.apiService.getLastPlayedGame().then(function (game) {
                _this.lastDatePlayed = game.datePlayed;
                var lastGame = new Date(_this.lastDatePlayed);
                var lastGameMonth = lastGame.getMonth();
                var lastGameYear = lastGame.getFullYear();
                _this.noGamesThisMonth = !(_this.currentMonth === lastGameMonth && _this.currentYear === lastGameYear);
            }, function () {
                console.error("Cannot get last game played.");
            });
        };
        LeaderboardController.$inject = ['dateTimeService', 'dotmService', 'apiService'];
        return LeaderboardController;
    }());
    Leaderboard_1.LeaderboardController = LeaderboardController;
})(Leaderboard || (Leaderboard = {}));

var Leaderboard;
(function (Leaderboard) {
    var LeaderboardModule = angular.module('LeaderboardModule', ['UxControlsModule', 'DotmModule', 'RankingsModule']);
    LeaderboardModule.component('leaderboard', Leaderboard.Leaderboard());
})(Leaderboard || (Leaderboard = {}));

//# sourceMappingURL=maps/index.js.map