var Shared;
(function (Shared) {
    var Player = (function () {
        function Player(player) {
            if (!player) {
                this.firstName = '';
                this.lastName = '';
                this.nickname = '';
                return;
            }
            this._id = player._id;
            this.firstName = player.firstName;
            this.lastName = player.lastName;
            this.nickname = player.nickname;
        }
        Object.defineProperty(Player.prototype, "initials", {
            get: function () {
                return this.firstName.charAt(0) + this.lastName.charAt(0);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Player.prototype, "fullname", {
            get: function () {
                return this.firstName + " " + this.lastName;
            },
            enumerable: true,
            configurable: true
        });
        Player.prototype.toPlayerViewModel = function () {
            var player = {
                _id: this._id,
                firstName: this.firstName,
                lastName: this.lastName,
                nickname: this.nickname
            };
            return player;
        };
        return Player;
    }());
    Shared.Player = Player;
})(Shared || (Shared = {}));
//# sourceMappingURL=Player.js.map