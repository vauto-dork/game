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
//# sourceMappingURL=RankingHistoryDirective.js.map