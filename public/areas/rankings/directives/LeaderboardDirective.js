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
        function LeaderboardController($scope, $http, dateTimeService) {
            this.$scope = $scope;
            this.$http = $http;
            this.dateTimeService = dateTimeService;
            this.noGamesThisMonth = false;
            this.currentMonth = dateTimeService.CurrentMonthValue();
            this.currentYear = dateTimeService.CurrentYear();
            this.lastMonth = dateTimeService.LastMonthValue();
            this.lastMonthYear = dateTimeService.LastMonthYear();
            this.getLastPlayedGame();
        }
        LeaderboardController.prototype.getLastPlayedGame = function () {
            var _this = this;
            this.$http.get("/Games/LastPlayed")
                .success(function (data, status, headers, config) {
                _this.lastDatePlayed = data.datePlayed;
                _this.noGamesThisMonth = _this.hasGames();
            })
                .error(function (data, status, headers, config) {
                debugger;
            });
        };
        LeaderboardController.prototype.hasGames = function () {
            var lastGame = new Date(this.lastDatePlayed);
            var lastGameMonth = lastGame.getMonth();
            var lastGameYear = lastGame.getFullYear();
            return !(this.currentMonth === lastGameMonth && this.currentYear === lastGameYear);
        };
        LeaderboardController.$inject = ['$scope', '$http', 'dateTimeService'];
        return LeaderboardController;
    })();
    Rankings.LeaderboardController = LeaderboardController;
})(Rankings || (Rankings = {}));
//# sourceMappingURL=LeaderboardDirective.js.map