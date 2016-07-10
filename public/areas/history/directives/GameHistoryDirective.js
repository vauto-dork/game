var DorkHistory;
(function (DorkHistory) {
    function GameHistoryDirective() {
        return {
            scope: {},
            templateUrl: '/areas/history/directives/GameHistoryTemplate.html',
            controller: 'GameHistoryController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    DorkHistory.GameHistoryDirective = GameHistoryDirective;
    var State;
    (function (State) {
        State[State["Init"] = 0] = "Init";
        State[State["Loading"] = 1] = "Loading";
        State[State["NoGames"] = 2] = "NoGames";
        State[State["Ready"] = 3] = "Ready";
        State[State["Error"] = 4] = "Error";
        State[State["Change"] = 5] = "Change";
    })(State || (State = {}));
    ;
    var GameHistoryController = (function () {
        function GameHistoryController($scope, $timeout, dateTimeService, monthYearQueryService, apiService) {
            this.$scope = $scope;
            this.$timeout = $timeout;
            this.dateTimeService = dateTimeService;
            this.monthYearQueryService = monthYearQueryService;
            this.apiService = apiService;
            this.loading = true;
            this.errorMessage = '';
            this.showErrorMessage = false;
            this.showNoGamesWarning = false;
            this.month = dateTimeService.currentMonthValue();
            this.year = dateTimeService.currentYear();
            this.changeState(State.Init);
        }
        GameHistoryController.prototype.changeState = function (newState) {
            var _this = this;
            this.loading = newState === State.Init
                || newState === State.Change
                || newState === State.Loading;
            this.showErrorMessage = newState === State.Error;
            this.showNoGamesWarning = newState === State.NoGames;
            switch (newState) {
                case State.Init:
                    this.$timeout(function () {
                        _this.month = _this.monthYearQueryService.getMonthQueryParam(_this.month);
                        _this.year = _this.monthYearQueryService.getYearQueryParam(_this.year);
                        _this.changeState(State.Loading);
                    }, 0);
                    break;
                case State.Change:
                    this.$timeout(function () {
                        _this.monthYearQueryService.saveQueryParams(_this.month, _this.year);
                        _this.changeState(State.Loading);
                    }, 0);
                    break;
                case State.Loading:
                    this.getGames();
                    break;
                case State.NoGames:
                    break;
                case State.Ready:
                    break;
            }
        };
        GameHistoryController.prototype.errorHandler = function (data, errorMessage) {
            this.errorMessage = errorMessage;
            console.error(data);
            this.changeState(State.Error);
        };
        GameHistoryController.prototype.getGames = function () {
            var _this = this;
            this.apiService.getGames(this.month, this.year).then(function (data) {
                _this.games = data;
                if (!data || data.length === 0) {
                    _this.changeState(State.NoGames);
                }
                else {
                    _this.changeState(State.Ready);
                }
            }, function (data) {
                _this.errorHandler(data, 'Error loading games!');
            });
        };
        GameHistoryController.prototype.updateQueryParams = function () {
            this.changeState(State.Change);
        };
        ;
        GameHistoryController.prototype.reload = function () {
            this.changeState(State.Loading);
        };
        ;
        GameHistoryController.$inject = ['$scope', '$timeout', 'dateTimeService', 'monthYearQueryService', 'apiService'];
        return GameHistoryController;
    })();
    DorkHistory.GameHistoryController = GameHistoryController;
})(DorkHistory || (DorkHistory = {}));
//# sourceMappingURL=GameHistoryDirective.js.map