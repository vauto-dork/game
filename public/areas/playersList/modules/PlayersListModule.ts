module PlayersList {
    var PlayersListModule = angular.module('PlayersListModule', ['UxControlsModule', 'PlayerFormModule']);

    PlayersListModule.service('alertsService', Shared.AlertsService);
    PlayersListModule.service('playersListService', PlayersListService);

    PlayersListModule.component('editPlayer', EditPlayer());
    PlayersListModule.component('playersList', PlayersList());
}