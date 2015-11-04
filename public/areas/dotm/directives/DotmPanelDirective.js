var Dotm;
(function (Dotm) {
    function DotmPanelDirective() {
        return {
            scope: {
                heading: "=",
                players: "="
            },
            templateUrl: '/areas/dotm/directives/DotmPanelTemplate.html',
            controller: 'DotmPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Dotm.DotmPanelDirective = DotmPanelDirective;
    var DotmPanelController = (function () {
        function DotmPanelController($scope) {
            this.$scope = $scope;
        }
        DotmPanelController.$inject = ['$scope'];
        return DotmPanelController;
    })();
    Dotm.DotmPanelController = DotmPanelController;
})(Dotm || (Dotm = {}));
//# sourceMappingURL=DotmPanelDirective.js.map