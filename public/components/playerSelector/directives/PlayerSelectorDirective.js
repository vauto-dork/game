var Component;
(function (Component) {
    function PlayerSelectorDirective() {
        return {
            scope: {
                players: "=",
                onSelected: "&",
                disabled: "="
            },
            templateUrl: "/components/PlayerSelector/directives/PlayerSelectorTemplate.html",
            controller: "PlayerSelectorController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Component.PlayerSelectorDirective = PlayerSelectorDirective;
    var PlayerSelectorController = (function () {
        function PlayerSelectorController($element, $timeout) {
            this.$element = $element;
            this.$timeout = $timeout;
            this.filter = "";
        }
        PlayerSelectorController.prototype.removeFilter = function () {
            this.filter = "";
        };
        PlayerSelectorController.prototype.selectPlayer = function (item, model, label) {
            this.$element.find("input").focus();
            this.onSelected({ data: item });
            this.removeFilter();
        };
        PlayerSelectorController.$inject = ["$element", "$timeout"];
        return PlayerSelectorController;
    }());
    Component.PlayerSelectorController = PlayerSelectorController;
})(Component || (Component = {}));
//# sourceMappingURL=PlayerSelectorDirective.js.map