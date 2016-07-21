var Shared;
(function (Shared) {
    function GlobalNavDirective() {
        return {
            scope: {},
            templateUrl: '/shared/directives/GlobalNavTemplate.html',
            controller: 'GlobalNavController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.GlobalNavDirective = GlobalNavDirective;
    var GlobalNavController = (function () {
        function GlobalNavController() {
            this.sidebarOpen = false;
        }
        GlobalNavController.prototype.closeSidebar = function () {
            if (this.sidebarOpen) {
                this.sidebarOpen = false;
            }
        };
        GlobalNavController.$inject = [];
        return GlobalNavController;
    }());
    Shared.GlobalNavController = GlobalNavController;
})(Shared || (Shared = {}));
//# sourceMappingURL=GlobalNavDirective.js.map