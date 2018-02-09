module Components {
    var DotyModule = angular.module('DotyModule', []);

    DotyModule.service('dotyService', DotyService);
    DotyModule.component('doty', Doty());
    DotyModule.component('dotyContainer', DotyContainer());
    DotyModule.component('uberdorkTable', UberdorkTable());
    DotyModule.component('winnerPlaceholder', WinnerPlaceholder());
}