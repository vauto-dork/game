var Shared;
(function (Shared) {
    var Game = (function () {
        function Game(game) {
            this._id = game._id;
            this.players = game.players.map(function (value) {
                return new Shared.GamePlayer(value);
            });
            this.datePlayed = game.datePlayed;
            this.winner = game.winner;
        }
        Game.prototype.toGameViewModel = function () {
            var game = {
                _id: this._id,
                players: this.players.map(function (value) {
                    return value.toGamePlayerViewModel();
                }),
                datePlayed: this.datePlayed,
                winner: this.winner.toPlayerViewModel()
            };
            return game;
        };
        return Game;
    })();
    Shared.Game = Game;
})(Shared || (Shared = {}));
//# sourceMappingURL=Game.js.map