module PlayerStats {
    var PlayerStatsModule = angular.module('PlayerStatsModule', ['UxControlsModule']);

    PlayerStatsModule.service('playerStatsService', PlayerStatsService);

    PlayerStatsModule.component('gameGraph', GameGraph());
    PlayerStatsModule.component('deltaBox', DeltaBox());
    PlayerStatsModule.component('playerStatsCard', PlayerStatsCard());
    PlayerStatsModule.component('playerStatsPage', PlayerStatsPage());
}