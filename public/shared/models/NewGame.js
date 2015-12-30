var Shared;
(function (Shared) {
    var NewGame = (function () {
        function NewGame(game) {
            if (!game) {
                this.firstGameOfMonth = true;
                this.players = [];
                return;
            }
            this.firstGameOfMonth = game.firstGameOfMonth;
            this.players = game.players.map(function (value) {
                return new Shared.NewGamePlayer(value);
            });
        }
        return NewGame;
    })();
    Shared.NewGame = NewGame;
})(Shared || (Shared = {}));
//# sourceMappingURL=NewGame.js.map