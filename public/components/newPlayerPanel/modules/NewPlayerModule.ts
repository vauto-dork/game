var newPlayerModule = angular.module('NewPlayerPanelModule', ['PlayerFormModule']);

newPlayerModule.service('newPlayerPanelService', Components.NewPlayerPanelService);

newPlayerModule.controller('NewPlayerButtonController', Components.NewPlayerButtonController);
newPlayerModule.directive('newPlayerButton', Components.NewPlayerButtonDirective);

newPlayerModule.controller('NewPlayerPanelController', Components.NewPlayerPanelController);
newPlayerModule.directive('newPlayerPanel', Components.NewPlayerPanelDirective);