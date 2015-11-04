module Rankings {
    export function RankingsDirective(): ng.IDirective {
        return {
            scope: {
                month: "=",
                year: "=",
                hideUnranked: "="
            },
            templateUrl: '/areas/rankings/directives/RankingsTemplate.html',
            controller: 'RankingsController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

    enum State {
        Loading,
        Loaded,
        Error,
        NoRankings
    };

    export class RankingsController {
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
        private numberUnranked: number = 0;

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
            this.showUnrankBtn = newState === State.Loaded && this.numberUnranked > 0;
            this.showErrorMessage = newState === State.Error;
            this.showNoRankingsMessage = newState === State.NoRankings;

            switch (newState) {
                case State.Loading:
                    this.getRankings();
                    break;
            }
        }

        private getRankings() {
            var rankingsPromise = this.rankingsService.GetRankings(this.month, this.year, this.hideUnranked);
            rankingsPromise.then(this.loadingSuccess.bind(this), (data) => {
                this.changeState(State.Error);
                console.error(data);
            });
        }

        private loadingSuccess() {
            this.players = this.rankingsService.GetPlayersOverTenGames();
            this.playersUnderTen = this.rankingsService.GetPlayersUnderTenGames();

            if (this.playersUnderTen.some((elem: Shared.IRankedPlayer) => { return elem.rank > 0; })) {
                this.numberUnranked = this.playersUnderTen.filter((element: Shared.IRankedPlayer) => { return element.rank <= 0; }).length;
                this.changeState(State.Loaded);
            } else {
                this.changeState(State.NoRankings);
            }
        }

        private hasNoRank(rank: number): string {
            if (rank > 0) {
                return '';
            }

            if (!this.showUnrankedPlayers) {
                return 'hidden';
            }

            return 'ranking-no-rank';
        };

        private toggleUnrankedPlayers() {
            this.showUnrankedPlayers = !this.showUnrankedPlayers;
        };
    }
}
