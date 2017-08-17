module Components {
    var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);

    PlayerSelectorModule.service('playerSelectionService', PlayerSelectionService);

    PlayerSelectorModule.filter('playerSelectorFilter', PlayerSelectorFilter);

    PlayerSelectorModule.component('playerSelector', PlayerSelector());
}