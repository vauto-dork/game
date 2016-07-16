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
        function PlayerSelectorController($element, $timeout) {
            this.$element = $element;
            this.$timeout = $timeout;
            this.filter = '';
        }
        PlayerSelectorController.prototype.removeFilter = function () {
            this.filter = '';
        };
        PlayerSelectorController.prototype.selectPlayer = function (item, model, label) {
            this.$element.find("input").focus();
            this.onSelected({ data: item });
            this.removeFilter();
        };
        PlayerSelectorController.$inject = ['$element', '$timeout'];
        return PlayerSelectorController;
    })();
    Shared.PlayerSelectorController = PlayerSelectorController;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerSelectorDirective.js.map