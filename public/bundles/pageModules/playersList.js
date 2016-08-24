var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule']);

DorkModule.service('alertsService', Shared.AlertsService);
DorkModule.service('playersListService', Players.PlayersListService);

DorkModule.controller('PlayersListController', Players.PlayersListController);
DorkModule.directive('playersList', Players.PlayersListDirective);

DorkModule.controller('PlayerFormController', Players.PlayerFormController);
DorkModule.directive('playerForm', Players.PlayerFormDirective);