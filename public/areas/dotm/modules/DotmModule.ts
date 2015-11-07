var DotmModule = angular.module('DotmModule', []);

DotmModule.controller('DotmController', Dotm.DotmController);
DotmModule.directive('dotm', Dotm.DotmDirective);