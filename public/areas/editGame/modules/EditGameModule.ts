var EditGameModule = angular.module('EditGameModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule', 'PlayerBonusPanelModule']);

EditGameModule.service('alertsService', Shared.AlertsService);
EditGameModule.service('editGameService', EditGame.EditGameService);
EditGameModule.service('editGameStateService', EditGame.EditGameStateService);
EditGameModule.service('editGameCollapseService', EditGame.EditGameCollapseService);

EditGameModule.controller('EditGameController', EditGame.EditGameController);
EditGameModule.directive('editGame', EditGame.EditGameDirective);

EditGameModule.controller('EditScoresController', EditGame.EditScoresController);
EditGameModule.directive('editScores', EditGame.EditScoresDirective);

EditGameModule.controller('ReorderPlayersController', EditGame.ReorderPlayersController);
EditGameModule.directive('reorderPlayers', EditGame.ReorderPlayersDirective);

EditGameModule.controller('ModifyPlayersController', EditGame.ModifyPlayersController);
EditGameModule.directive('modifyPlayers', EditGame.ModifyPlayersDirective);

EditGameModule.controller('RevertFinalizeController', EditGame.RevertFinalizeController);
EditGameModule.directive('revertFinalize', EditGame.RevertFinalizeDirective);
