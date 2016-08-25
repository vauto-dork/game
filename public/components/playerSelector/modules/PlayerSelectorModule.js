var PlayerSelectorModule = angular.module('PlayerSelectorModule', ['PlayerFormModule']);
PlayerSelectorModule.service('playerSelectionService', Components.PlayerSelectionService);
PlayerSelectorModule.filter('playerSelectorFilter', Components.PlayerSelectorFilter);
PlayerSelectorModule.controller('PlayerSelectorController', Components.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Components.PlayerSelectorDirective);
//# sourceMappingURL=PlayerSelectorModule.js.map