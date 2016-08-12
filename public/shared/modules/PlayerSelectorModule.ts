var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);

PlayerSelectorModule.filter('playerSelectorFilter', Shared.PlayerSelectorFilter);

PlayerSelectorModule.controller('PlayerSelectorController', Shared.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Shared.PlayerSelectorDirective);