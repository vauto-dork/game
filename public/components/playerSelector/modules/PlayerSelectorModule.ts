var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);

PlayerSelectorModule.service('playerSelectionService', Component.PlayerSelectionService);
PlayerSelectorModule.filter('playerSelectorFilter', Component.PlayerSelectorFilter);

PlayerSelectorModule.controller('PlayerSelectorController', Component.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Component.PlayerSelectorDirective);