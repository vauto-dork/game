var EditActiveGameModule = angular.module('EditActiveGameModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);

EditActiveGameModule.service('alertsService', Shared.AlertsService);
EditActiveGameModule.service('editActiveGameService', EditActiveGame.EditActiveGameService);
EditActiveGameModule.service('editActiveGameCollapseService', EditActiveGame.EditActiveGameCollapseService);

EditActiveGameModule.controller('EditActiveGameController', EditActiveGame.EditActiveGameController);
EditActiveGameModule.directive('editActiveGame', EditActiveGame.EditActiveGameDirective);

EditActiveGameModule.controller('EditScoresController', EditActiveGame.EditScoresController);
EditActiveGameModule.directive('editScores', EditActiveGame.EditScoresDirective);

EditActiveGameModule.controller('ReorderPlayersController', EditActiveGame.ReorderPlayersController);
EditActiveGameModule.directive('reorderPlayers', EditActiveGame.ReorderPlayersDirective);

EditActiveGameModule.controller('ModifyPlayersController', EditActiveGame.ModifyPlayersController);
EditActiveGameModule.directive('modifyPlayers', EditActiveGame.ModifyPlayersDirective);

EditActiveGameModule.controller('RevertFinalizeController', EditActiveGame.RevertFinalizeController);
EditActiveGameModule.directive('revertFinalize', EditActiveGame.RevertFinalizeDirective);

EditActiveGameModule.controller('PlayerBonusPanelController', Shared.PlayerBonusPanelController);
EditActiveGameModule.directive('playerBonusPanel', Shared.PlayerBonusPanelDirective);