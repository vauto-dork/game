module Components {
    var DotmModule = angular.module('DotmModule', []);

    DotmModule.service('dotmService', DotmService);
    DotmModule.component('dotm', Dotm());
}