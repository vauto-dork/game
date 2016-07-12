var Shared;
(function (Shared) {
    function PlayerSelectorDirective() {
        return {
            scope: {
                players: '=',
                onSelected: '&',
                disabled: '='
            },
            templateUrl: '/shared/directives/PlayerSelectorTemplate.html',
            controller: 'PlayerSelectorController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerSelectorDirective = PlayerSelectorDirective;
    var PlayerSelectorController = (function () {
        function PlayerSelectorController($scope, $element, $timeout, apiService) {
            this.$scope = $scope;
            this.$element = $element;
            this.$timeout = $timeout;
            this.apiService = apiService;
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
        PlayerSelectorController.$inject = ['$scope', '$element', '$timeout', 'apiService'];
        return PlayerSelectorController;
    }());
    Shared.PlayerSelectorController = PlayerSelectorController;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerSelectorDirective.js.map