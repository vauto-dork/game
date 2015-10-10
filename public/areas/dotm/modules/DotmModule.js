var DotmModule = angular.module('DotmModule', []);

DotmModule.controller('DotmController', DotmController);
DotmModule.directive('dotm', DotmDirective);

DotmModule.controller('DotmPanelController', DotmPanelController);
DotmModule.directive('dotmPanel', DotmPanelDirective);