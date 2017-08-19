module Rankings {
    var RankingsModule = angular.module('RankingsModule', []);

    RankingsModule.service('rankingsService', RankingsService);

    RankingsModule.component('rankingsCard', RankingsCard());
    RankingsModule.component('rankingsPanel', RankingsPanel());
}