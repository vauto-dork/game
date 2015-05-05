var DorkModule = angular.module('DorkModule', []);

DorkModule.controller('RankingsController', RankingsController);
DorkModule.directive('rankings', Rankings);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', Playlist);