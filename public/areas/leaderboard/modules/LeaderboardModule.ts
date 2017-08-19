module Leaderboard {
    var LeaderboardModule = angular.module('LeaderboardModule', ['UxControlsModule', 'DotmModule', 'RankingsModule']);
    
    LeaderboardModule.component('leaderboard', Leaderboard());
}