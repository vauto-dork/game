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
        function DotmController($scope, $http) {
            var _this = this;
            this.$scope = $scope;
            this.$http = $http;
            this.showDorks = false;
            this.hasUberdorks = false;
            this.hasNegadorks = false;
            this.uberdorkHeading = 'Uberdork';
            this.negadorkHeading = 'Negadork';
            this.getDotm();
            $scope.$watchGroup([function () { return _this.month; }, function () { return _this.year; }], function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    _this.getDotm();
                }
            });
        }
        DotmController.prototype.getDotm = function () {
            var _this = this;
            var query = '?month=' + this.month + '&year=' + this.year;
            this.$http.get("/Players/dotm" + query)
                .success(function (data, status, headers, config) {
                _this.loaded(data);
            }).
                error(function (data, status, headers, config) {
                debugger;
            });
        };
        DotmController.prototype.loaded = function (data) {
            this.dotm = data;
            this.hasUberdorks = data.uberdorks.length > 0;
            // Let's not show negadorks because it's not nice.
            //me.hasNegadorks = data.negadorks.length > 0;
            this.showDorks = true;
        };
        DotmController.$inject = ['$scope', '$http'];
        return DotmController;
    })();
    Dotm.DotmController = DotmController;
})(Dotm || (Dotm = {}));
//# sourceMappingURL=DotmDirective.js.map