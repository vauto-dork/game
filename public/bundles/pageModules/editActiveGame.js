var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);

DorkModule.service('alertsService', Shared.AlertsService);
DorkModule.service('editActiveGameService', EditActiveGame.EditActiveGameService);
DorkModule.service('editActiveGameCollapseService', EditActiveGame.EditActiveGameCollapseService);

DorkModule.controller('EditActiveGameController', EditActiveGame.EditActiveGameController);
DorkModule.directive('editActiveGame', EditActiveGame.EditActiveGameDirective);

DorkModule.controller('EditScoresController', EditActiveGame.EditScoresController);
DorkModule.directive('editScores', EditActiveGame.EditScoresDirective);

DorkModule.controller('ReorderPlayersController', EditActiveGame.ReorderPlayersController);
DorkModule.directive('reorderPlayers', EditActiveGame.ReorderPlayersDirective);

DorkModule.controller('ModifyPlayersController', EditActiveGame.ModifyPlayersController);
DorkModule.directive('modifyPlayers', EditActiveGame.ModifyPlayersDirective);

DorkModule.controller('RevertFinalizeController', EditActiveGame.RevertFinalizeController);
DorkModule.directive('revertFinalize', EditActiveGame.RevertFinalizeDirective);

DorkModule.controller('PlayerBonusPanelController', Shared.PlayerBonusPanelController);
DorkModule.directive('playerBonusPanel', Shared.PlayerBonusPanelDirective);