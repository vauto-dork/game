var EditActiveGame;
(function (EditActiveGame) {
    function RevertFinalizeDirective() {
        return {
            scope: {
                save: "&",
                revert: "&",
                finalize: "&",
                disabled: "="
            },
            templateUrl: '/areas/editActiveGame/directives/RevertFinalizeTemplate.html',
            controller: 'RevertFinalizeController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.RevertFinalizeDirective = RevertFinalizeDirective;
    var RevertFinalizeController = (function () {
        function RevertFinalizeController(editActiveGameService) {
            this.editActiveGameService = editActiveGameService;
        }
        Object.defineProperty(RevertFinalizeController.prototype, "numPlayers", {
            get: function () {
                return this.editActiveGameService.players.length;
            },
            enumerable: true,
            configurable: true
        });
        RevertFinalizeController.$inject = ['editActiveGameService'];
        return RevertFinalizeController;
    }());
    EditActiveGame.RevertFinalizeController = RevertFinalizeController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=RevertFinalizeDirective.js.map