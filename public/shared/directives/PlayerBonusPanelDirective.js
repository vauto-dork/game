var Shared;
(function (Shared) {
    function PlayerBonusPanelDirective() {
        return {
            scope: {
                numPlayers: "="
            },
            templateUrl: '/shared/directives/PlayerBonusPanelTemplate.html',
            controller: 'PlayerBonusPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerBonusPanelDirective = PlayerBonusPanelDirective;
    var PlayerBonusPanelController = (function () {
        function PlayerBonusPanelController() {
        }
        PlayerBonusPanelController.$inject = [];
        return PlayerBonusPanelController;
    }());
    Shared.PlayerBonusPanelController = PlayerBonusPanelController;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerBonusPanelDirective.js.map