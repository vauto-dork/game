var DotmModule = angular.module('DotmModule', []);

DotmModule.controller('DotmController', Dotm.DotmController);
DotmModule.directive('dotm', Dotm.DotmDirective);

DotmModule.controller('DotmPanelController', Dotm.DotmPanelController);
DotmModule.directive('dotmPanel', Dotm.DotmPanelDirective);