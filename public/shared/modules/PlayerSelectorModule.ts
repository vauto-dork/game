var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);

PlayerSelectorModule.service('playerSelectionService', Shared.PlayerSelectionService);
PlayerSelectorModule.filter('playerSelectorFilter', Shared.PlayerSelectorFilter);

PlayerSelectorModule.controller('PlayerSelectorController', Shared.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Shared.PlayerSelectorDirective);