module Component {
    export function PlayerSelectorFilter() {
        return (playersList: Shared.INewGamePlayer[], filter: string): Shared.INewGamePlayer[] => {
            var caseInsensitiveMatch = (value: string, filter: string) => {
                return value.toUpperCase().search(filter.toUpperCase()) >= 0;
            };

            var initials = playersList.filter(player => {
                return caseInsensitiveMatch(player.player.initials, filter);
            });

            var nicknames = playersList.filter(player => {
                return caseInsensitiveMatch(player.player.nickname, filter);
            }).sort((a,b) => {
                if(a.player.nickname.length < b.player.nickname.length)
                    return -1;

                if(a.player.nickname.length > b.player.nickname.length)
                    return 1;
                
                return 0;
            });

            var fullname = playersList.filter(player => {
                return caseInsensitiveMatch(player.player.fullname, filter);
            });

            var output: Shared.INewGamePlayer[] = [];
            var existsInOutput = (playerId: string) => {
                return !output.length || output.map(p => { return p.playerId; }).indexOf(playerId) === -1;
            };

            initials.forEach(player => {
                output.push(player);
            });

            nicknames.forEach(player => {
                if(existsInOutput(player.playerId)) {
                    output.push(player);
                }
            });

            fullname.forEach(player => {
                if(existsInOutput(player.playerId)) {
                    output.push(player);
                }
            });

            var inactivePlayers = output.filter(player => {
                return player.player.inactive;
            });

            return output.filter(player => {
                return !player.player.inactive;
            }).concat(inactivePlayers);
        };
    }
}