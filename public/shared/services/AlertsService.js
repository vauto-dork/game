var Shared;
(function (Shared) {
    var AlertsService = (function () {
        function AlertsService($timeout, $window) {
            this.$timeout = $timeout;
            this.$window = $window;
            this.alertsList = [];
        }
        Object.defineProperty(AlertsService.prototype, "alerts", {
            get: function () {
                return this.alertsList;
            },
            enumerable: true,
            configurable: true
        });
        AlertsService.prototype.closeAlert = function (index) {
            this.alertsList.splice(index, 1);
        };
        AlertsService.prototype.addAlert = function (messageType, message) {
            this.alertsList.push({ type: messageType, msg: message });
        };
        AlertsService.prototype.clearAlerts = function () {
            this.alertsList = [];
        };
        AlertsService.prototype.scrollToTop = function () {
            var _this = this;
            this.$timeout(function () {
                _this.$window.scrollTo(0, 0);
            });
        };
        AlertsService.prototype.scrollToBottom = function () {
            var _this = this;
            this.$timeout(function () {
                _this.$window.scrollTo(0, 100000);
            });
        };
        AlertsService.$inject = ['$timeout', '$window'];
        return AlertsService;
    }());
    Shared.AlertsService = AlertsService;
})(Shared || (Shared = {}));
//# sourceMappingURL=AlertsService.js.map