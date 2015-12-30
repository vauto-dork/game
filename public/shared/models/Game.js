var Shared;
(function (Shared) {
    var Game = (function () {
        function Game(game) {
            if (!game) {
                this.players = [];
                return;
            }
            this._id = game._id;
            this.players = game.players.map(function (value) {
                return new Shared.GamePlayer(value);
            });
            this.datePlayed = game.datePlayed;
            this.winner = new Shared.Player(game.winner);
        }
        Game.prototype.getIdAsPath = function () {
            return "/" + this._id;
        };
        Game.prototype.toGameViewModel = function () {
            var game = {
                _id: this._id,
                players: this.players.map(function (value) {
                    return value.toGamePlayerViewModel();
                }),
                datePlayed: this.datePlayed,
                winner: !this.winner ? null : this.winner.toPlayerViewModel()
            };
            return game;
        };
        return Game;
    })();
    Shared.Game = Game;
})(Shared || (Shared = {}));
//# sourceMappingURL=Game.js.map