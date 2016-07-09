var Shared;
(function (Shared) {
    function DatePickerDirective() {
        return {
            scope: {
                date: "=",
                disabled: "="
            },
            templateUrl: '/shared/directives/DatePickerTemplate.html',
            controller: 'DatePickerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.DatePickerDirective = DatePickerDirective;
    var DatePickerController = (function () {
        function DatePickerController($scope) {
            this.$scope = $scope;
            this.format = 'MMMM dd, yyyy';
            this.hstep = 1;
            this.mstep = 1;
            this.opened = false;
            this.dateOptions = {
                showWeeks: false,
                startingDay: 0
            };
        }
        DatePickerController.prototype.open = function () {
            this.opened = true;
        };
        DatePickerController.$inject = ['$scope'];
        return DatePickerController;
    })();
    Shared.DatePickerController = DatePickerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=DatePickerDirective.js.map