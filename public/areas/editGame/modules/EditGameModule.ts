module EditGame {
    var EditGameModule = angular.module('EditGameModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule', 'PlayerBonusPanelModule']);

    EditGameModule.service('alertsService', Shared.AlertsService);
    EditGameModule.service('editGameService', EditGameService);
    EditGameModule.service('editGameStateService', EditGameStateService);
    EditGameModule.service('editGameCollapseService', EditGameCollapseService);

    EditGameModule.component('editGame', EditGame());
    EditGameModule.component('editScores', EditScores());
    EditGameModule.component('reorderPlayers', ReorderPlayers());
    EditGameModule.component('modifyPlayers', ModifyPlayers());
    EditGameModule.component('revertFinalize', RevertFinalize());
}