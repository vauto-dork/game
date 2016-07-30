var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'GameCardModule']);

DorkModule.controller('ActiveGamesController', ActiveGame.ActiveGamesController);
DorkModule.directive('activeGames', ActiveGame.ActiveGamesDirective);