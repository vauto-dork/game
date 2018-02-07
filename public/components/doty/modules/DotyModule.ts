module Components {
    var DotyModule = angular.module('DotyModule', []);

    DotyModule.service('dotyService', DotyService);
    DotyModule.component('doty', Doty());
    DotyModule.component('uberdorkTable', UberdorkTable());
}