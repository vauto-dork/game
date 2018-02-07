module RankingHistory {
    var RankingHistoryModule = angular.module('RankingHistoryModule', ['UxControlsModule', 'DotyModule', 'DotmModule', 'RankingsModule']);
    
    RankingHistoryModule.component('rankingHistory', RankingHistory());
}