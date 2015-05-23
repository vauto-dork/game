var RankingsModule = angular.module('RankingsModule', []);

RankingsModule.factory('playerNameFactory', PlayerNameFactory);

RankingsModule.controller('RankingsController', RankingsController);
RankingsModule.directive('rankings', RankingsDirective);
