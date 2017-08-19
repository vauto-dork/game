module GameHistory {
    var GameHistoryModule = angular.module('GameHistoryModule', ['UxControlsModule', 'GameCardModule']);
    
    GameHistoryModule.component('gameHistory', GameHistory());
}