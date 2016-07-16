var Shared;
(function (Shared) {
    var NewGamePlayer = (function () {
        function NewGamePlayer(player) {
            if (!player) {
                this.player = new Shared.Player();
                return;
            }
            this.player = new Shared.Player(player.player);
            this.rating = player.rating;
            this.orderNumber = player.orderNumber;
        }
        Object.defineProperty(NewGamePlayer.prototype, "playerId", {
            get: function () {
                return this.player._id;
            },
            enumerable: true,
            configurable: true
        });
        NewGamePlayer.prototype.toGamePlayerViewModel = function () {
            var player = {
                player: this.player.toPlayerViewModel()
            };
            return player;
        };
        return NewGamePlayer;
    })();
    Shared.NewGamePlayer = NewGamePlayer;
})(Shared || (Shared = {}));
//# sourceMappingURL=NewGamePlayer.js.map