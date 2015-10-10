var AddPlayerModule = angular.module('AddPlayerModule', []);

AddPlayerModule.controller('AddPlayerController', AddPlayerController);
AddPlayerModule.directive('addPlayer', AddPlayerDirective);

AddPlayerModule.controller('PlayerFormController', PlayerFormController);
AddPlayerModule.directive('playerForm', PlayerFormDirective);