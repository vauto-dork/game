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
    var State;
    (function (State) {
        State[State["Ready"] = 0] = "Ready";
        State[State["Disabled"] = 1] = "Disabled";
        State[State["Editing"] = 2] = "Editing";
    })(State || (State = {}));
    ;
    var DatePickerController = (function () {
        function DatePickerController($scope) {
            this.$scope = $scope;
            this.isDisabled = false;
            this.showStatic = false;
            this.showEditor = false;
            this.format = 'MMMM dd, yyyy';
            this.hstep = 1;
            this.mstep = 1;
            this.opened = false;
            this.dateOptions = {
                showWeeks: false
            };
            this.changeState(State.Ready);
        }
        Object.defineProperty(DatePickerController.prototype, "disabled", {
            get: function () {
                return this.isDisabled;
            },
            set: function (value) {
                this.isDisabled = value;
                this.changeState(value ? State.Disabled : State.Ready);
            },
            enumerable: true,
            configurable: true
        });
        ;
        DatePickerController.prototype.changeState = function (newState) {
            this.showStatic = newState === State.Ready || newState === State.Disabled;
            this.showEditor = newState === State.Editing;
        };
        DatePickerController.prototype.today = function () {
            this.date = new Date();
        };
        DatePickerController.prototype.clear = function () {
            this.date = null;
        };
        DatePickerController.prototype.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            this.opened = true;
        };
        DatePickerController.prototype.edit = function () {
            this.changeState(State.Editing);
        };
        DatePickerController.$inject = ['$scope'];
        return DatePickerController;
    })();
    Shared.DatePickerController = DatePickerController;
})(Shared || (Shared = {}));
//# sourceMappingURL=DatePickerDirective.js.map