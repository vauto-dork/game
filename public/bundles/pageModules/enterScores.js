var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);

DorkModule.service('enterScoresService', EnterScores.EnterScoresService);

DorkModule.controller('EnterScoresController', EnterScores.EnterScoresController);
DorkModule.directive('enterScores', EnterScores.EnterScoresDirective);
