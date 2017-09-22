var AdminPanel;
(function (AdminPanel_1) {
    function AdminPanel() {
        return {
            templateUrl: "/areas/adminPanel/directives/AdminPanelTemplate.html",
            controller: AdminPanelController
        };
    }
    AdminPanel_1.AdminPanel = AdminPanel;
    var AdminPanelController = (function () {
        function AdminPanelController() {
        }
        AdminPanelController.$inject = [];
        return AdminPanelController;
    }());
    AdminPanel_1.AdminPanelController = AdminPanelController;
})(AdminPanel || (AdminPanel = {}));

var AdminPanel;
(function (AdminPanel) {
    var AdminPanelModule = angular.module("AdminPanelModule", ["UxControlsModule"]);
    AdminPanelModule.component("adminPanel", AdminPanel.AdminPanel());
})(AdminPanel || (AdminPanel = {}));

//# sourceMappingURL=maps/admin.js.map