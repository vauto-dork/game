var EditActiveGame;
(function (EditActiveGame) {
    function EditScoresDirective() {
        return {
            scope: {
                disabled: '='
            },
            templateUrl: '/areas/editActiveGame/directives/EditScoresTemplate.html',
            controller: 'EditScoresController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    EditActiveGame.EditScoresDirective = EditScoresDirective;
    var EditScoresController = (function () {
        function EditScoresController($scope, editActiveGameService) {
            this.$scope = $scope;
            this.editActiveGameService = editActiveGameService;
            this.pointsMin = -4;
            this.pointsMax = 99;
        }
        Object.defineProperty(EditScoresController.prototype, "players", {
            get: function () {
                return this.editActiveGameService.getGamePlayers();
            },
            enumerable: true,
            configurable: true
        });
        EditScoresController.prototype.rankHandler = function (player) {
            player.rank = player.rank === null ? 0 : player.rank;
            this.players.forEach(function (p) {
                if (p._id !== player._id) {
                    if (player.rank > 0 && p.rank === player.rank) {
                        p.rank = 0;
                    }
                }
            });
        };
        EditScoresController.prototype.decrementScore = function (player) {
            if (!this.disabled) {
                var points = player.points;
                player.points = (points - 1 >= this.pointsMin) ? points - 1 : points;
            }
        };
        EditScoresController.prototype.incrementScore = function (player) {
            if (!this.disabled) {
                var points = player.points;
                player.points = (points + 1 <= this.pointsMax) ? points + 1 : points;
            }
        };
        ;
        EditScoresController.prototype.toggleRemoved = function (player) {
            player.removed = !player.removed;
        };
        EditScoresController.$inject = ['$scope', 'editActiveGameService'];
        return EditScoresController;
    })();
    EditActiveGame.EditScoresController = EditScoresController;
})(EditActiveGame || (EditActiveGame = {}));
//# sourceMappingURL=EditScoresDirective.js.map