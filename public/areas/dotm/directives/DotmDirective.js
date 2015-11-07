var Dotm;
(function (Dotm) {
    function DotmDirective() {
        return {
            scope: {
                month: "=",
                year: "="
            },
            templateUrl: '/areas/dotm/directives/DotmTemplate.html',
            controller: 'DotmController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Dotm.DotmDirective = DotmDirective;
    var DotmController = (function () {
        function DotmController($scope, apiService) {
            var _this = this;
            this.$scope = $scope;
            this.apiService = apiService;
            this.hasUberdorks = false;
            this.getDotm();
            $scope.$watchGroup([function () { return _this.month; }, function () { return _this.year; }], function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    _this.getDotm();
                }
            });
        }
        DotmController.prototype.getDotm = function () {
            var _this = this;
            this.hasUberdorks = false;
            this.apiService.getDotm(this.month, this.year).then(function (data) {
                _this.dotm = data;
                _this.hasUberdorks = data.uberdorks.length > 0;
            }, function () {
                debugger;
            });
        };
        DotmController.$inject = ['$scope', 'apiService'];
        return DotmController;
    })();
    Dotm.DotmController = DotmController;
})(Dotm || (Dotm = {}));
//# sourceMappingURL=DotmDirective.js.map