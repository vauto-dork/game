var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);

DorkModule.service('enterScoresService', EnterScores.EnterScoresService);

DorkModule.controller('GameTimePanelController', EnterScores.GameTimePanelController);
DorkModule.directive('gameTimePanel', EnterScores.GameTimePanelDirective);

DorkModule.controller('EnterScoresController', EnterScores.EnterScoresController);
DorkModule.directive('enterScores', EnterScores.EnterScoresDirective);
