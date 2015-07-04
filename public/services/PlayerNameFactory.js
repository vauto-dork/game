var PlayerNameFactory = function () {
    return {
		playerNameFormat: function(player) {
			player.fullname = player.firstName + ' ' + player.lastName;
			player.initials = player.firstName.charAt(0) + player.lastName.charAt(0);
			return player;
		}
    };
};

PlayerNameFactory.$inject = [];