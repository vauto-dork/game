var Shared;
(function (Shared) {
    var GamePlayer = (function () {
        function GamePlayer(player) {
            if (!player) {
                this.player = new Shared.Player();
                return;
            }
            this._id = player._id;
            this.player = new Shared.Player(player.player);
            this.rank = player.rank || 0;
            this.points = player.points || 0;
        }
        GamePlayer.prototype.toGamePlayerViewModel = function () {
            var player = {
                _id: this._id,
                player: this.player.toPlayerViewModel(),
                rank: this.rank,
                points: this.points
            };
            return player;
        };
        return GamePlayer;
    })();
    Shared.GamePlayer = GamePlayer;
})(Shared || (Shared = {}));
//# sourceMappingURL=GamePlayer.js.map