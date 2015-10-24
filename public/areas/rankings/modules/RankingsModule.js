var RankingsModule = angular.module('RankingsModule', []);

RankingsModule.factory('rankingsFactory', RankingsFactory);

RankingsModule.controller('RankingsCardController', RankingsCardController);
RankingsModule.directive('rankingsCard', RankingsCardDirective);

RankingsModule.controller('RankingsController', RankingsController);
RankingsModule.directive('rankings', RankingsDirective);