var Shared;
(function (Shared) {
    var RankedPlayer = (function () {
        function RankedPlayer(player) {
            this._id = player._id;
            this.player = new Shared.Player(player.player);
            this.totalPoints = player.totalPoints || 0;
            this.gamesPlayed = player.gamesPlayed || 0;
            this.rating = player.rating || 0;
            this.rank = 0;
        }
        RankedPlayer.prototype.toRankedPlayerViewModel = function () {
            var player = {
                _id: this._id,
                player: this.player.toPlayerViewModel(),
                totalPoints: player.totalPoints,
                gamesPlayed: player.gamesPlayed,
                rating: player.rating
            };
            return player;
        };
        return RankedPlayer;
    })();
    Shared.RankedPlayer = RankedPlayer;
})(Shared || (Shared = {}));
//# sourceMappingURL=RankedPlayer.js.map