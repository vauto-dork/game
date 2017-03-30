var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerSelectorModule', 'NewPlayerPanelModule']);

DorkModule.service('enterScoresService', EnterScores.EnterScoresService);

DorkModule.controller('TempPlayerPanelController', EnterScores.TempPlayerPanelController);
DorkModule.directive('tempPlayerPanel', EnterScores.TempPlayerPanelDirective);

DorkModule.controller('EditScoresPanelController', EnterScores.EditScoresPanelController);
DorkModule.directive('editScoresPanel', EnterScores.EditScoresPanelDirective);

DorkModule.controller('GameTimePanelController', EnterScores.GameTimePanelController);
DorkModule.directive('gameTimePanel', EnterScores.GameTimePanelDirective);

DorkModule.controller('ScoreFormPanelController', EnterScores.ScoreFormPanelController);
DorkModule.directive('scoreFormPanel', EnterScores.ScoreFormPanelDirective);

DorkModule.controller('EnterScoresController', EnterScores.EnterScoresController);
DorkModule.directive('enterScores', EnterScores.EnterScoresDirective);
