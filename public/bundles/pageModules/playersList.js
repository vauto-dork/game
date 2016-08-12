var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.service('alertsService', Shared.AlertsService);

DorkModule.controller('PlayersListController', Players.PlayersListController);
DorkModule.directive('playersList', Players.PlayersListDirective);

DorkModule.controller('PlayerFormController', Players.PlayerFormController);
DorkModule.directive('playerForm', Players.PlayerFormDirective);