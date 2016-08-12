var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule']);

DorkModule.service('playerSelectionService', Shared.PlayerSelectionService);
DorkModule.service('createGameService', CreateGame.CreateGameService);

DorkModule.controller('ButtonsPanelController', CreateGame.ButtonsPanelController);
DorkModule.directive('buttonsPanel', CreateGame.ButtonsPanelDirective);

DorkModule.controller('SelectedPlayersController', CreateGame.SelectedPlayersController);
DorkModule.directive('selectedPlayers', CreateGame.SelectedPlayersDirective);

DorkModule.controller('CreateGameController', CreateGame.CreateGameController);
DorkModule.directive('createGame', CreateGame.CreateGameDirective);