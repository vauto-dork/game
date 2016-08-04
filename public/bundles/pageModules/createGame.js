var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.service('playerSelectionService', Shared.PlayerSelectionService);
DorkModule.service('createGameService', CreateGame.CreateGameService);

DorkModule.controller('PlayerSelectorController', Shared.PlayerSelectorController);
DorkModule.directive('playerSelector', Shared.PlayerSelectorDirective);

DorkModule.controller('ButtonsPanelController', CreateGame.ButtonsPanelController);
DorkModule.directive('buttonsPanel', CreateGame.ButtonsPanelDirective);

DorkModule.controller('SelectedPlayersController', CreateGame.SelectedPlayersController);
DorkModule.directive('selectedPlayers', CreateGame.SelectedPlayersDirective);

DorkModule.controller('CreateGameController', CreateGame.CreateGameController);
DorkModule.directive('createGame', CreateGame.CreateGameDirective);