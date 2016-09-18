var DorkModule = angular.module('DorkModule', ['UxControlsModule', 'PlayerFormModule']);

DorkModule.controller('AddPlayerController', Players.AddPlayerController);
DorkModule.directive('addPlayer', Players.AddPlayerDirective);
