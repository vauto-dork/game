var Rankings;
(function (Rankings) {
    function LeaderboardDirective() {
        return {
            scope: {},
            templateUrl: '/areas/rankings/directives/LeaderboardTemplate.html',
            controller: 'LeaderboardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Rankings.LeaderboardDirective = LeaderboardDirective;
    var LeaderboardController = (function () {
        function LeaderboardController($scope, dateTimeService, apiService) {
            this.$scope = $scope;
            this.dateTimeService = dateTimeService;
            this.apiService = apiService;
            this.noGamesThisMonth = false;
            this.currentMonth = dateTimeService.currentMonthValue();
            this.currentYear = dateTimeService.currentYear();
            this.lastMonth = dateTimeService.lastMonthValue();
            this.lastMonthYear = dateTimeService.lastMonthYear();
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
                debugger;
            });
        };
        LeaderboardController.$inject = ['$scope', 'dateTimeService', 'apiService'];
        return LeaderboardController;
    })();
    Rankings.LeaderboardController = LeaderboardController;
})(Rankings || (Rankings = {}));
//# sourceMappingURL=LeaderboardDirective.js.map