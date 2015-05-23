var PlaylistModule = angular.module('PlaylistModule', []);

PlaylistModule.factory('playerNameFactory', PlayerNameFactory);

PlaylistModule.controller('PlaylistController', PlaylistController);
PlaylistModule.directive('playlist', PlaylistDirective);