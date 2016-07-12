var Rankings;
(function (Rankings) {
    function RankingsCardDirective() {
        return {
            scope: {
                player: "="
            },
            templateUrl: '/areas/rankings/directives/RankingsCardTemplate.html',
            controller: 'RankingsCardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Rankings.RankingsCardDirective = RankingsCardDirective;
    var RankingsCardController = (function () {
        function RankingsCardController() {
        }
        RankingsCardController.$inject = [];
        return RankingsCardController;
    }());
    Rankings.RankingsCardController = RankingsCardController;
})(Rankings || (Rankings = {}));
//# sourceMappingURL=RankingsCardDirective.js.map