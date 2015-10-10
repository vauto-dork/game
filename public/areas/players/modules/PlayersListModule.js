var PlayersListModule = angular.module('PlayersListModule', []);

PlayersListModule.controller('PlayersListController', PlayersListController);
PlayersListModule.directive('playersList', PlayersListDirective);

PlayersListModule.controller('PlayerFormController', PlayerFormController);
PlayersListModule.directive('playerForm', PlayerFormDirective);