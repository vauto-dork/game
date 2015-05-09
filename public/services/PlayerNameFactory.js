var PlayerNameFactory = function () {
    return {
    	playerFullName: function(player) {
		    return player.firstName + ' ' + player.lastName;
		},

		playerInitials: function(player) {
			return player.firstName.charAt(0) + player.lastName.charAt(0);
		}
    };
}

PlayerNameFactory.$inject = [];