module DorkOfTheYear {
    var DotyModule = angular.module('DotyModule', ['UxControlsModule', 'RankingsModule']);

    DotyModule.service('dotyService', DotyService);
    DotyModule.component('doty', Doty());
    DotyModule.component('dorkOfTheYear', DorkOfTheYear());
    DotyModule.component('uberdorkTable', UberdorkTable());
    DotyModule.component('winnerPlaceholder', WinnerPlaceholder());
}