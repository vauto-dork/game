module Components {
    var DotyModule = angular.module('DotyModule', []);

    DotyModule.service('dotyService', DotyService);
    DotyModule.component('doty', Doty());
}