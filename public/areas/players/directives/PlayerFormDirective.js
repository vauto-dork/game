var Players;
(function (Players) {
    function PlayerFormDirective() {
        return {
            scope: {
                player: "=",
                disableForm: "="
            },
            templateUrl: '/areas/players/directives/PlayerFormTemplate.html',
            controller: 'PlayerFormController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Players.PlayerFormDirective = PlayerFormDirective;
    var PlayerFormController = (function () {
        function PlayerFormController() {
            this.disableForm = false;
        }
        PlayerFormController.$inject = [];
        return PlayerFormController;
    }());
    Players.PlayerFormController = PlayerFormController;
})(Players || (Players = {}));
//# sourceMappingURL=PlayerFormDirective.js.map