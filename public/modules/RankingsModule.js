var DorkModule = angular.module('RankingsModule', []);

DorkModule.factory('playerNameFactory', PlayerNameFactory);

DorkModule.controller('RankingsController', RankingsController);
DorkModule.directive('rankings', RankingsDirective);
