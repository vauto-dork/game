var DorkModule = angular.module('PlaylistModule', []);

DorkModule.factory('playerNameFactory', PlayerNameFactory);

DorkModule.controller('PlaylistController', PlaylistController);
DorkModule.directive('playlist', PlaylistDirective);