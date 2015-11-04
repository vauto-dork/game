var RankingsModule = angular.module('RankingsModule', []);

RankingsModule.service('rankingsService', Rankings.RankingsService);

RankingsModule.controller('RankingsCardController', Rankings.RankingsCardController);
RankingsModule.directive('rankingsCard', Rankings.RankingsCardDirective);

RankingsModule.controller('RankingsController', Rankings.RankingsController);
RankingsModule.directive('rankings', Rankings.RankingsDirective);