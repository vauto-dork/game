var DorkModule = angular.module('DorkModule', ['UxControlsModule']);

DorkModule.controller('AddPlayerController', Players.AddPlayerController);
DorkModule.directive('addPlayer', Players.AddPlayerDirective);

DorkModule.controller('PlayerFormController', Players.PlayerFormController);
DorkModule.directive('playerForm', Players.PlayerFormDirective);
