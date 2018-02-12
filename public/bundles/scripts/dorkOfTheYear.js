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
                player: "=",
                month: "=?",
                year: "=?"
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
                if (_this.useQueryParams()) {
                    _this.appendQueryParams("" + date.getVisibleQueryString());
                }
            });
            var date = monthYearQueryService.getQueryParams();
            if (this.useQueryParams()) {
                this.appendQueryParams(!date ? "" : "" + date.getVisibleQueryString());
            }
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
        RankingsCardController.prototype.useQueryParams = function () {
            var monthNull = this.month === null || this.month === undefined;
            var yearNull = this.year === null || this.year === undefined;
            var useMonthAndYearParams = !monthNull && !yearNull;
            if (useMonthAndYearParams) {
                this.playerStatsUrl = this.playerStatsBaseUrl + "#?month=" + this.month + "&year=" + this.year;
                return false;
            }
            return true;
        };
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
var DorkOfTheYear;
(function (DorkOfTheYear) {
    var DotyService = (function (_super) {
        __extends(DotyService, _super);
        function DotyService($timeout, apiService) {
            var _this = _super.call(this, $timeout) || this;
            _this.apiService = apiService;
            _this.events = {
                dateChanged: "dateChanged"
            };
            return _this;
        }
        Object.defineProperty(DotyService.prototype, "data", {
            get: function () {
                return this.localDotyData;
            },
            enumerable: true,
            configurable: true
        });
        DotyService.prototype.changeDate = function (year) {
            this.getDoty(year);
        };
        DotyService.prototype.subscribeDateChange = function (callback) {
            this.subscribe(this.events.dateChanged, callback);
        };
        DotyService.prototype.getDoty = function (year) {
            var _this = this;
            this.apiService.getDoty(year).then(function (data) {
                _this.localDotyData = data;
                _this.publish(_this.events.dateChanged, null);
            }, function () {
                console.error("Cannot get DOTY.");
            });
        };
        DotyService.$inject = ["$timeout", "apiService"];
        return DotyService;
    }(Shared.PubSubServiceBase));
    DorkOfTheYear.DotyService = DotyService;
})(DorkOfTheYear || (DorkOfTheYear = {}));

var DorkOfTheYear;
(function (DorkOfTheYear_1) {
    function DorkOfTheYear() {
        return {
            templateUrl: '/areas/dorkOfTheYear/directives/DorkOfTheYearTemplate.html',
            controller: DorkOfTheYearController
        };
    }
    DorkOfTheYear_1.DorkOfTheYear = DorkOfTheYear;
    var State;
    (function (State) {
        State[State["Init"] = 0] = "Init";
        State[State["Ready"] = 1] = "Ready";
        State[State["Change"] = 2] = "Change";
    })(State || (State = {}));
    ;
    var DorkOfTheYearController = (function () {
        function DorkOfTheYearController($timeout, monthYearQueryService, dateTimeService, dotyService) {
            this.$timeout = $timeout;
            this.monthYearQueryService = monthYearQueryService;
            this.dateTimeService = dateTimeService;
            this.dotyService = dotyService;
            this.showLoading = true;
            this.showDoty = false;
            this.changeState(State.Init);
        }
        DorkOfTheYearController.prototype.changeState = function (newState) {
            var _this = this;
            this.showLoading = newState !== State.Ready;
            this.showDoty = newState === State.Ready;
            switch (newState) {
                case State.Init:
                    this.$timeout(function () {
                        var date = _this.monthYearQueryService.getQueryParams();
                        if (date) {
                            _this.year = date.year;
                        }
                        else {
                            _this.year = _this.dateTimeService.currentYear();
                        }
                        _this.changeState(State.Change);
                    }, 0);
                    break;
                case State.Change:
                    this.$timeout(function () {
                        _this.monthYearQueryService.saveQueryParams(null, _this.year);
                        _this.dotyService.changeDate(_this.year);
                    }, 0);
                    this.changeState(State.Ready);
                    break;
            }
        };
        DorkOfTheYearController.prototype.updateQueryParams = function () {
            this.changeState(State.Change);
        };
        DorkOfTheYearController.$inject = ['$timeout', 'monthYearQueryService', 'dateTimeService', 'dotyService'];
        return DorkOfTheYearController;
    }());
    DorkOfTheYear_1.DorkOfTheYearController = DorkOfTheYearController;
})(DorkOfTheYear || (DorkOfTheYear = {}));

var DorkOfTheYear;
(function (DorkOfTheYear) {
    function Doty() {
        return {
            templateUrl: '/areas/dorkOfTheYear/directives/DotyTemplate.html',
            controller: DotyController
        };
    }
    DorkOfTheYear.Doty = Doty;
    var DotyController = (function () {
        function DotyController(dotyService) {
            this.dotyService = dotyService;
        }
        Object.defineProperty(DotyController.prototype, "year", {
            get: function () {
                return !this.data ? null : this.data.year;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DotyController.prototype, "data", {
            get: function () {
                return this.dotyService.data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DotyController.prototype, "hasUberdorks", {
            get: function () {
                return !this.data ? false : this.data.doty.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        DotyController.$inject = ['dotyService'];
        return DotyController;
    }());
    DorkOfTheYear.DotyController = DotyController;
})(DorkOfTheYear || (DorkOfTheYear = {}));

var DorkOfTheYear;
(function (DorkOfTheYear) {
    function UberdorkTable() {
        return {
            templateUrl: '/areas/dorkOfTheYear/directives/UberdorkTableTemplate.html',
            controller: UberdorkTableController
        };
    }
    DorkOfTheYear.UberdorkTable = UberdorkTable;
    var UberdorkTableController = (function () {
        function UberdorkTableController(dateTimeService, dotyService) {
            this.dateTimeService = dateTimeService;
            this.dotyService = dotyService;
        }
        Object.defineProperty(UberdorkTableController.prototype, "monthlyRankings", {
            get: function () {
                return !this.dotyService.data ? [] : this.dotyService.data.monthlyRankings;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UberdorkTableController.prototype, "year", {
            get: function () {
                return !this.dotyService.data ? new Date().getFullYear() : this.dotyService.data.year;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UberdorkTableController.prototype, "currentYear", {
            get: function () {
                return this.dateTimeService.currentYear();
            },
            enumerable: true,
            configurable: true
        });
        UberdorkTableController.prototype.monthName = function (value, abbreviate) {
            return this.dateTimeService.monthName(value, abbreviate);
        };
        UberdorkTableController.$inject = ['dateTimeService', 'dotyService'];
        return UberdorkTableController;
    }());
    DorkOfTheYear.UberdorkTableController = UberdorkTableController;
})(DorkOfTheYear || (DorkOfTheYear = {}));

var DorkOfTheYear;
(function (DorkOfTheYear) {
    function WinnerPlaceholder() {
        return {
            templateUrl: '/areas/dorkOfTheYear/directives/WinnerPlaceholderTemplate.html',
            controller: WinnerPlaceholderController,
            bindings: {
                pastGame: "="
            }
        };
    }
    DorkOfTheYear.WinnerPlaceholder = WinnerPlaceholder;
    var WinnerPlaceholderController = (function () {
        function WinnerPlaceholderController(dotyService) {
            this.dotyService = dotyService;
            this.player = new Shared.RankedPlayer();
            this.player.player.firstName = this.pastGame ? "No" : "This could";
            this.player.player.lastName = this.pastGame ? "Uberdork" : "be you!";
            this.player.player.customInitials = "—";
            this.player.rating = 0;
            this.player.totalPoints = 0;
            this.player.gamesPlayed = 0;
        }
        WinnerPlaceholderController.$inject = ['dotyService'];
        return WinnerPlaceholderController;
    }());
    DorkOfTheYear.WinnerPlaceholderController = WinnerPlaceholderController;
})(DorkOfTheYear || (DorkOfTheYear = {}));

var DorkOfTheYear;
(function (DorkOfTheYear) {
    var DotyModule = angular.module('DotyModule', ['UxControlsModule', 'RankingsModule']);
    DotyModule.service('dotyService', DorkOfTheYear.DotyService);
    DotyModule.component('doty', DorkOfTheYear.Doty());
    DotyModule.component('dorkOfTheYear', DorkOfTheYear.DorkOfTheYear());
    DotyModule.component('uberdorkTable', DorkOfTheYear.UberdorkTable());
    DotyModule.component('winnerPlaceholder', DorkOfTheYear.WinnerPlaceholder());
})(DorkOfTheYear || (DorkOfTheYear = {}));

//# sourceMappingURL=maps/dorkOfTheYear.js.map