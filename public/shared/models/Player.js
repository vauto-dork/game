var Shared;
(function (Shared) {
    var Player = (function () {
        function Player(player) {
            if (!player) {
                this.firstName = '';
                this.lastName = '';
                this.nickname = '';
                this.initials = '';
                this.fullname = '';
                return;
            }
            this._id = player._id;
            this.firstName = player.firstName;
            this.lastName = player.lastName;
            this.nickname = player.nickname;
            this.fullname = player.firstName + " " + player.lastName;
            this.initials = player.firstName.charAt(0) + player.lastName.charAt(0);
        }
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
    })();
    Shared.Player = Player;
})(Shared || (Shared = {}));
//# sourceMappingURL=Player.js.map