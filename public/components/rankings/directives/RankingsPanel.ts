module Rankings {
    export function RankingsPanel(): ng.IComponentOptions {
        return {
            bindings: {
                month: "=",
                year: "=",
                hideUnranked: "="
            },
            templateUrl: '/components/rankings/directives/RankingsPanelTemplate.html',
            controller: RankingsPanelController
        };
    }

    enum State {
        Loading,
        Loaded,
        Error,
        NoRankings
    };

    export class RankingsPanelController {
        public static $inject: string[] = ['$scope', 'rankingsService'];
        private month: number;
        private year: number;
        private hideUnranked: boolean;

        private showLoading: boolean = true;
        private showRankings: boolean = false;
        private showUnrankedPlayers: boolean = false;
        private showUnrankBtn: boolean = false;
        private showErrorMessage: boolean = false;
        private showNoRankingsMessage: boolean = false;

        private players: Shared.IRankedPlayer[] = [];
        private playersUnderTen: Shared.IRankedPlayer[] = [];
        private numberNoGames: number = 0;

        constructor(private $scope: ng.IScope, private rankingsService: IRankingsService) {
            $scope.$watchGroup([() => this.month, () => this.year],
                (newValue, oldValue) => {
                    if ((newValue !== oldValue)) {
                        this.changeState(State.Loading);
                    }
                });

            this.changeState(State.Loading);
        }

        private changeState(newState: State) {
            this.showLoading = newState === State.Loading;
            this.showRankings = newState === State.Loaded;
            this.showUnrankBtn = newState === State.Loaded && this.numberNoGames > 0;
            this.showErrorMessage = newState === State.Error;
            this.showNoRankingsMessage = newState === State.NoRankings;

            switch (newState) {
                case State.Loading:
                    this.getRankings();
                    break;
            }
        }

        private getRankings() {
            this.rankingsService.getRankings(this.month, this.year, this.hideUnranked)
                .then(this.loadingSuccess.bind(this), (data) => {
                    this.changeState(State.Error);
                    console.error(data);
                });
        }

        private loadingSuccess() {
            this.players = this.rankingsService.getPlayersOverTenGames();
            this.playersUnderTen = this.rankingsService.getPlayersUnderTenGames();

            if (this.playersUnderTen.some(elem => { return elem.gamesPlayed > 0; })) {
                this.numberNoGames = this.playersUnderTen.filter(element => { return element.gamesPlayed <= 0; }).length;
                this.changeState(State.Loaded);
            } else {
                this.changeState(State.NoRankings);
            }
        }

        private hasNoRank(player: Shared.IRankedPlayer): string {
            if (player.gamesPlayed > 0) {
                return '';
            }

            if (!this.showUnrankedPlayers) {
                return 'hidden';
            }

            return 'ranking-no-rank';
        }

        private toggleUnrankedPlayers() {
            this.showUnrankedPlayers = !this.showUnrankedPlayers;
        }
    }
}
