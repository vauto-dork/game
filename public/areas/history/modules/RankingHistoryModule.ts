module DorkHistory {
    var RankingHistoryModule = angular.module('RankingHistoryModule', ['UxControlsModule', 'DotmModule', 'RankingsModule']);
    
    RankingHistoryModule.component('rankingHistory', RankingHistory());
}