var Components;
(function (Components) {
    function PlayerFormDirective() {
        return {
            scope: {
                player: "=",
                disableForm: "="
            },
            templateUrl: "/components/playerForm/directives/PlayerFormTemplate.html",
            controller: "PlayerFormController",
            controllerAs: "ctrl",
            bindToController: true
        };
    }
    Components.PlayerFormDirective = PlayerFormDirective;
    var PlayerFormController = (function () {
        function PlayerFormController() {
            this.disableForm = false;
        }
        PlayerFormController.$inject = [];
        return PlayerFormController;
    }());
    Components.PlayerFormController = PlayerFormController;
})(Components || (Components = {}));
//# sourceMappingURL=PlayerFormDirective.js.map