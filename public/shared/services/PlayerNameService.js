var Shared;
(function (Shared) {
    var PlayerNameService = (function () {
        function PlayerNameService() {
        }
        PlayerNameService.prototype.PlayerNameFormat = function (player) {
            var newPlayer = {
                _id: player._id,
                __v: player.__v,
                firstName: player.firstName,
                lastName: player.lastName,
                nickname: player.nickname,
                fullname: player.firstName + " " + player.lastName,
                initials: player.firstName.charAt(0) + player.lastName.charAt(0)
            };
            return newPlayer;
        };
        return PlayerNameService;
    })();
    Shared.PlayerNameService = PlayerNameService;
})(Shared || (Shared = {}));
//# sourceMappingURL=PlayerNameService.js.map