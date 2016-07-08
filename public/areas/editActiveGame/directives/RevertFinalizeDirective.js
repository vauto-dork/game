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
        function RevertFinalizeController() {
        }
        RevertFinalizeController.$inject = [];
        return RevertFinalizeController;
    }());
    EditActiveGame.RevertFinalizeController = RevertFinalizeController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=RevertFinalizeDirective.js.map