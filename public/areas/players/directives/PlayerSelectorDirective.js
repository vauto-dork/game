var Players;
(function (Players) {
    function PlayerSelectorDirective() {
        return {
            scope: {
                players: '=',
                onSelected: '&'
            },
            templateUrl: '/areas/players/directives/PlayerSelectorTemplate.html',
            controller: 'PlayerSelectorController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Players.PlayerSelectorDirective = PlayerSelectorDirective;
    var PlayerSelectorController = (function () {
        function PlayerSelectorController($scope, $element, $timeout) {
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.filter = '';
            $scope.$on('PlayerSelectorFocus', function (event, data) {
                // Wrapped in timeout so it does this after UI is rendered.
                $timeout(function () {
                    $element.find("input").focus();
                });
            });
            $scope.$on('PlayerSelectorBlur', function (event, data) {
                // UI should be already rendered at this point so timeout is not needed.
                $element.find("input").blur();
            });
        }
        PlayerSelectorController.prototype.removeFilter = function () {
            this.filter = '';
        };
        PlayerSelectorController.prototype.selectPlayer = function (item, model, label) {
            this.$element.find("input").focus();
            this.onSelected({ data: item });
            this.removeFilter();
        };
        PlayerSelectorController.prototype.getUnselectedPlayers = function () {
            return this.players.filter(function (element) {
                return !element.selected;
            });
        };
        ;
        PlayerSelectorController.$inject = ['$scope', '$element', '$timeout'];
        return PlayerSelectorController;
    })();
    Players.PlayerSelectorController = PlayerSelectorController;
})(Players || (Players = {}));
//# sourceMappingURL=PlayerSelectorDirective.js.map