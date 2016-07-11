var Shared;
(function (Shared) {
    function LoadSpinnerDirective() {
        return {
            scope: {},
            template: '<div class="load-bar"><img src="/images/loader.gif" width="220" height="19" /></div>',
            controller: 'LoadSpinnerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.LoadSpinnerDirective = LoadSpinnerDirective;
    var LoadSpinnerController = (function () {
        function LoadSpinnerController() {
        }
        LoadSpinnerController.$inject = [];
        return LoadSpinnerController;
    }());
    Shared.LoadSpinnerController = LoadSpinnerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=LoadSpinnerDirective.js.map