var Shared;
(function (Shared) {
    var Game = (function () {
        function Game(game) {
            if (!game) {
                this.players = [];
                return;
            }
            this._id = game._id;
            this.players = game.players.map(function (value) {
                return new Shared.GamePlayer(value);
            });
            this.datePlayed = game.datePlayed;
            this.winner = new Shared.Player(game.winner);
        }
        Game.prototype.getIdAsPath = function () {
            return "/" + this._id;
        };
        Game.prototype.toGameViewModel = function () {
            var game = {
                _id: this._id,
                players: this.players.map(function (value) {
                    return value.toGamePlayerViewModel();
                }),
                datePlayed: this.datePlayed,
                winner: !this.winner ? null : this.winner.toPlayerViewModel()
            };
            return game;
        };
        return Game;
    }());
    Shared.Game = Game;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var GamePlayer = (function () {
        function GamePlayer(player) {
            if (!player) {
                this.player = new Shared.Player();
                return;
            }
            this._id = player._id;
            this.player = new Shared.Player(player.player);
            this.rank = player.rank || 0;
            this.points = player.points || 0;
        }
        Object.defineProperty(GamePlayer.prototype, "playerId", {
            get: function () {
                return this.player._id;
            },
            enumerable: true,
            configurable: true
        });
        GamePlayer.prototype.toGamePlayerViewModel = function () {
            var player = {
                _id: this._id,
                player: this.player.toPlayerViewModel(),
                rank: this.rank,
                points: this.points
            };
            return player;
        };
        return GamePlayer;
    }());
    Shared.GamePlayer = GamePlayer;
})(Shared || (Shared = {}));


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
    }());
    Shared.NewGame = NewGame;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var NewGamePlayer = (function () {
        function NewGamePlayer(player) {
            if (!player) {
                this.player = new Shared.Player();
                return;
            }
            this.player = new Shared.Player(player.player);
            this.rating = player.rating;
            this.orderNumber = player.orderNumber;
        }
        Object.defineProperty(NewGamePlayer.prototype, "playerId", {
            get: function () {
                return this.player._id;
            },
            enumerable: true,
            configurable: true
        });
        NewGamePlayer.prototype.toGamePlayerViewModel = function () {
            var player = {
                player: this.player.toPlayerViewModel()
            };
            return player;
        };
        return NewGamePlayer;
    }());
    Shared.NewGamePlayer = NewGamePlayer;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var Player = (function () {
        function Player(player) {
            if (!player) {
                this.firstName = '';
                this.lastName = '';
                this.nickname = '';
                this.customInitials = '';
                this.duplicate = '';
                this.inactive = false;
                return;
            }
            this._id = player._id;
            this.firstName = player.firstName;
            this.lastName = player.lastName;
            this.nickname = player.nickname;
            this.customInitials = player.customInitials;
            this.duplicate = player.duplicate;
            this.inactive = player.inactive;
        }
        Object.defineProperty(Player.prototype, "initials", {
            get: function () {
                return this.customInitials || (this.firstName.charAt(0) + this.lastName.charAt(0));
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
                nickname: this.nickname,
                customInitials: this.customInitials,
                duplicate: this.duplicate,
                inactive: this.inactive
            };
            return player;
        };
        return Player;
    }());
    Shared.Player = Player;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var RankedPlayer = (function () {
        function RankedPlayer(player) {
            if (!player) {
                this.player = new Shared.Player();
                this.totalPoints = 0;
                this.gamesPlayed = 0;
                this.rating = 0;
                this.rank = 0;
                return;
            }
            this._id = player._id;
            this.player = new Shared.Player(player.player);
            this.totalPoints = player.totalPoints || 0;
            this.gamesPlayed = player.gamesPlayed || 0;
            this.rating = player.rating || 0;
            this.rank = 0;
        }
        RankedPlayer.prototype.toRankedPlayerViewModel = function () {
            var player = {
                _id: this._id,
                player: this.player.toPlayerViewModel(),
                totalPoints: player.totalPoints,
                gamesPlayed: player.gamesPlayed,
                rating: player.rating
            };
            return player;
        };
        return RankedPlayer;
    }());
    Shared.RankedPlayer = RankedPlayer;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function PlayerSelectorFilter() {
        return function (playersList, filter) {
            var caseInsensitiveMatch = function (value, filter) {
                return value.toUpperCase().search(filter.toUpperCase()) >= 0;
            };
            var initials = playersList.filter(function (player) {
                return caseInsensitiveMatch(player.player.initials, filter);
            });
            var nicknames = playersList.filter(function (player) {
                return caseInsensitiveMatch(player.player.nickname, filter);
            }).sort(function (a, b) {
                if (a.player.nickname.length < b.player.nickname.length)
                    return -1;
                if (a.player.nickname.length > b.player.nickname.length)
                    return 1;
                return 0;
            });
            var fullname = playersList.filter(function (player) {
                return caseInsensitiveMatch(player.player.fullname, filter);
            });
            var output = [];
            var existsInOutput = function (playerId) {
                return !output.length || output.map(function (p) { return p.playerId; }).indexOf(playerId) === -1;
            };
            initials.forEach(function (player) {
                output.push(player);
            });
            nicknames.forEach(function (player) {
                if (existsInOutput(player.playerId)) {
                    output.push(player);
                }
            });
            fullname.forEach(function (player) {
                if (existsInOutput(player.playerId)) {
                    output.push(player);
                }
            });
            var inactivePlayers = output.filter(function (player) {
                return player.player.inactive;
            });
            return output.filter(function (player) {
                return !player.player.inactive;
            }).concat(inactivePlayers);
        };
    }
    Shared.PlayerSelectorFilter = PlayerSelectorFilter;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var AlertsService = (function () {
        function AlertsService($timeout, $window) {
            this.$timeout = $timeout;
            this.$window = $window;
            this.alertsList = [];
        }
        Object.defineProperty(AlertsService.prototype, "alerts", {
            get: function () {
                return this.alertsList;
            },
            enumerable: true,
            configurable: true
        });
        AlertsService.prototype.closeAlert = function (index) {
            this.alertsList.splice(index, 1);
        };
        AlertsService.prototype.addAlert = function (messageType, message) {
            this.alertsList.push({ type: messageType, msg: message });
        };
        AlertsService.prototype.clearAlerts = function () {
            this.alertsList = [];
        };
        AlertsService.prototype.scrollToTop = function () {
            var _this = this;
            this.$timeout(function () {
                _this.$window.scrollTo(0, 0);
            });
        };
        AlertsService.prototype.scrollToBottom = function () {
            var _this = this;
            this.$timeout(function () {
                _this.$window.scrollTo(0, 100000);
            });
        };
        AlertsService.$inject = ['$timeout', '$window'];
        return AlertsService;
    }());
    Shared.AlertsService = AlertsService;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var ApiService = (function () {
        function ApiService($http, $q) {
            this.$http = $http;
            this.$q = $q;
        }
        ApiService.prototype.getActiveGamePath = function (gameIdPath) {
            return '/ActiveGames/json' + gameIdPath;
        };
        ApiService.prototype.getEditActiveGamePath = function (gameId) {
            return '/activeGames/edit/#/' + gameId;
        };
        ApiService.prototype.getAllActiveGames = function () {
            var def = this.$q.defer();
            this.$http.get(this.getActiveGamePath(''))
                .success(function (data, status, headers, config) {
                if (data === null || data === undefined) {
                    def.reject(status);
                }
                else {
                    var game = data.map(function (value) {
                        return new Shared.Game(value);
                    });
                    def.resolve(game);
                }
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot get active games");
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getActiveGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.get(this.getActiveGamePath(gameIdPath))
                .success(function (data, status, headers, config) {
                if (data === null || data === undefined) {
                    def.reject(status);
                }
                else {
                    def.resolve(new Shared.Game(data));
                }
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot get game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getPlayersForNewGame = function () {
            var def = this.$q.defer();
            this.$http.get('/players/newgame')
                .success(function (data, status, headers, config) {
                def.resolve(new Shared.NewGame(data));
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get players for new game');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.createActiveGame = function (game) {
            var _this = this;
            var def = this.$q.defer();
            var gameViewModel = game.toGameViewModel();
            this.$http.post('/activeGames/save', gameViewModel)
                .success(function (data, status, headers, config) {
                def.resolve(_this.getEditActiveGamePath(data._id));
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot create active game');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.saveActiveGame = function (gameIdPath, game) {
            var def = this.$q.defer();
            this.$http.put(this.getActiveGamePath(gameIdPath), game)
                .success(function (data, status, headers, config) {
                def.resolve();
            }).
                error(function (data, status, headers, config) {
                console.error("Cannot save active game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.deleteActiveGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.delete(this.getActiveGamePath(gameIdPath))
                .success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot delete active game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.saveNewPlayer = function (player) {
            var def = this.$q.defer();
            this.$http.post('/players', player)
                .success(function (data, status, headers, config) {
                def.resolve();
            }).error(function (data, status, headers, config) {
                console.error('Cannot save player.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.saveExistingPlayer = function (player) {
            var def = this.$q.defer();
            this.$http.put('players/' + player._id, player)
                .success(function (data, status, headers, config) {
                def.resolve();
            }).error(function (data, status, headers, config) {
                console.error('Cannot save player.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getAllPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.$http.get('/players?sort=true')
                .success(function (data, status, headers, config) {
                var allPlayers = data;
                var formattedPlayers = _this.playerNameFormat(allPlayers);
                def.resolve(formattedPlayers);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get all players.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getRankedPlayers = function (month, year, hideUnranked) {
            var def = this.$q.defer();
            month = (month === undefined || month === null) ? new Date().getMonth() : month;
            year = (year === undefined || year === null) ? new Date().getFullYear() : year;
            var unrankedParam = hideUnranked ? '&hideUnranked=true' : '';
            var rankedUrl = '/players/ranked?month=' + month + '&year=' + year + unrankedParam;
            this.$http.get(rankedUrl)
                .success(function (data, status, headers, config) {
                var players = data.map(function (value) {
                    return new Shared.RankedPlayer(value);
                });
                def.resolve(players);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get ranked players.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.playerNameFormat = function (rawPlayersList) {
            var playersList = rawPlayersList.map(function (value) {
                return new Shared.Player(value);
            });
            return playersList;
        };
        ApiService.prototype.getDotm = function (month, year) {
            var def = this.$q.defer();
            var query = '?month=' + month + '&year=' + year;
            this.$http.get("/Players/dotm" + query)
                .success(function (data, status, headers, config) {
                def.resolve(data);
            }).
                error(function (data, status, headers, config) {
                console.error('Cannot get dorks of the month.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getLastPlayedGame = function () {
            var def = this.$q.defer();
            this.$http.get("/Games/LastPlayed")
                .success(function (data, status, headers, config) {
                def.resolve(new Shared.Game(data));
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get last game played.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.getGames = function (month, year) {
            var def = this.$q.defer();
            var path = '/Games?month=' + month + '&year=' + year;
            this.$http.get(path).success(function (data, status, headers, config) {
                var game = data.map(function (value) {
                    return new Shared.Game(value);
                });
                def.resolve(game);
            })
                .error(function (data, status, headers, config) {
                console.error('Cannot get games played.');
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.finalizeGame = function (game) {
            var def = this.$q.defer();
            this.$http.post('/games', game.toGameViewModel()).success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot finalize game. Status code: " + status + ".");
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.prototype.deleteGame = function (gameIdPath) {
            var def = this.$q.defer();
            this.$http.delete("/games" + gameIdPath)
                .success(function (data, status, headers, config) {
                def.resolve();
            })
                .error(function (data, status, headers, config) {
                console.error("Cannot delete game with id " + gameIdPath);
                def.reject(data);
            });
            return def.promise;
        };
        ApiService.$inject = ['$http', '$q'];
        return ApiService;
    }());
    Shared.ApiService = ApiService;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var DateTimeService = (function () {
        function DateTimeService() {
            this.monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            this.abbrMonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
                "July", "Aug", "Sept", "Oct", "Nov", "Dec"
            ];
        }
        DateTimeService.prototype.currentYear = function () {
            return new Date().getFullYear();
        };
        DateTimeService.prototype.currentMonthValue = function () {
            return new Date().getMonth();
        };
        DateTimeService.prototype.currentMonthName = function () {
            return this.monthNames[this.currentMonthValue()];
        };
        DateTimeService.prototype.lastMonthYear = function () {
            return (this.currentMonthValue() - 1 < 0) ? this.currentYear() - 1 : this.currentYear();
        };
        DateTimeService.prototype.lastMonthValue = function () {
            return (this.currentMonthValue() - 1 < 0) ? 11 : this.currentMonthValue() - 1;
        };
        DateTimeService.prototype.lastMonthName = function () {
            return this.monthNames[this.lastMonthValue()];
        };
        DateTimeService.prototype.monthName = function (monthValue, abbreviateMonth) {
            var monthNames = abbreviateMonth ? this.abbrMonthNames : this.monthNames;
            if (monthValue >= 0 && monthValue <= 11) {
                return monthNames[monthValue];
            }
            return '';
        };
        DateTimeService.prototype.beautifyDate = function (date, abbreviateMonth) {
            if (!date) {
                return {
                    month: this.monthName(0, abbreviateMonth),
                    day: 1,
                    year: 1970,
                    hour: 12,
                    minute: 0,
                    ampm: "AM"
                };
            }
            ;
            var hour = date.getHours();
            return {
                month: this.monthName(date.getMonth(), abbreviateMonth),
                day: date.getDate(),
                year: date.getFullYear(),
                hour: hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour),
                minute: date.getMinutes(),
                ampm: hour >= 12 ? "PM" : "AM"
            };
        };
        return DateTimeService;
    }());
    Shared.DateTimeService = DateTimeService;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var MonthYearQueryService = (function () {
        function MonthYearQueryService($location) {
            this.$location = $location;
            this.minimumYear = 2015;
        }
        MonthYearQueryService.prototype.SanitizeParam = function (value) {
            if (value === undefined) {
                return undefined;
            }
            var parsedValue = parseInt(value, 10);
            return isNaN(parsedValue) ? undefined : parsedValue;
        };
        ;
        MonthYearQueryService.prototype.getMonthQueryParam = function (month) {
            var queryMonth = this.SanitizeParam(this.$location.search().month);
            if (queryMonth !== undefined) {
                queryMonth--;
                month = queryMonth > 11
                    ? 0
                    : queryMonth < 0 ? 11 : queryMonth;
            }
            return month;
        };
        MonthYearQueryService.prototype.getYearQueryParam = function (year) {
            var queryYear = this.SanitizeParam(this.$location.search().year);
            if (queryYear !== undefined) {
                year = queryYear < this.minimumYear ? this.minimumYear : queryYear;
            }
            return year;
        };
        MonthYearQueryService.prototype.saveQueryParams = function (month, year) {
            this.$location.search('month', month + 1);
            this.$location.search('year', year);
            this.$location.replace();
        };
        MonthYearQueryService.$inject = ['$location'];
        return MonthYearQueryService;
    }());
    Shared.MonthYearQueryService = MonthYearQueryService;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var PlayerSelectionService = (function () {
        function PlayerSelectionService($q, apiService) {
            this.$q = $q;
            this.apiService = apiService;
            this.allPlayers = [];
            this.players = [];
            this.unselectedPlayersList = [];
        }
        Object.defineProperty(PlayerSelectionService.prototype, "selectedPlayers", {
            get: function () {
                return this.players;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PlayerSelectionService.prototype, "unselectedPlayers", {
            get: function () {
                return this.unselectedPlayersList;
            },
            enumerable: true,
            configurable: true
        });
        PlayerSelectionService.prototype.playerIndex = function (playerId) {
            return this.players.map(function (p) { return p.playerId; }).indexOf(playerId);
        };
        PlayerSelectionService.prototype.addPlayer = function (player) {
            var found = this.allPlayers.filter(function (p) { return p.playerId === player._id; });
            if (found.length === 1) {
                this.players.push(found[0]);
                this.curateNewPlayerList();
            }
            else {
                console.error("Player not found.", player);
            }
        };
        PlayerSelectionService.prototype.removePlayer = function (player) {
            var index = this.playerIndex(player._id);
            this.players.splice(index, 1);
            this.curateNewPlayerList();
        };
        PlayerSelectionService.prototype.getPlayers = function () {
            var _this = this;
            var def = this.$q.defer();
            this.apiService.getPlayersForNewGame().then(function (data) {
                _this.allPlayers = data.players;
                def.resolve(data);
            }, function () {
                _this.allPlayers = [];
                def.reject();
            });
            return def.promise;
        };
        PlayerSelectionService.prototype.curateNewPlayerList = function () {
            var currentPlayerIds = this.players.map(function (p) { return p.playerId; });
            this.unselectedPlayersList = this.allPlayers.filter(function (player) {
                return currentPlayerIds.indexOf(player.playerId) === -1;
            });
        };
        PlayerSelectionService.prototype.reset = function () {
            this.players = [];
            this.curateNewPlayerList();
        };
        PlayerSelectionService.prototype.debugShowAllPlayersTable = function () {
            this.debugPrintPlayersTable(this.allPlayers);
        };
        PlayerSelectionService.prototype.debugShowCuratedPlayersTable = function () {
            this.debugPrintPlayersTable(this.unselectedPlayers);
        };
        PlayerSelectionService.prototype.debugPrintPlayersTable = function (players) {
            console.info(players.map(function (p) {
                return {
                    orderNumber: p.orderNumber,
                    rating: p.rating,
                    name: p.player.fullname
                };
            }));
        };
        PlayerSelectionService.$inject = ['$q', 'apiService'];
        return PlayerSelectionService;
    }());
    Shared.PlayerSelectionService = PlayerSelectionService;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    var PubSubServiceBase = (function () {
        function PubSubServiceBase($timeout) {
            this.$timeout = $timeout;
            this.topics = {};
            this.subUid = -1;
        }
        PubSubServiceBase.prototype.subscribe = function (callbackId, callback, once) {
            var token = this.subUid += 1;
            if (!this.topics[callbackId]) {
                this.topics[callbackId] = [];
            }
            var obj = {
                token: token,
                callback: callback,
                once: !!once
            };
            this.topics[callbackId].push(obj);
            return token;
        };
        PubSubServiceBase.prototype.subscribeOnce = function (callbackId, callback) {
            return this.subscribe(callbackId, callback, true);
        };
        PubSubServiceBase.prototype.publish = function (callbackId, params) {
            var _this = this;
            if (!this.topics[callbackId])
                return;
            this.$timeout(function () {
                var subscribers = _this.topics[callbackId];
                var len = subscribers ? subscribers.length : 0;
                while (len) {
                    len -= 1;
                    subscribers[len].callback(callbackId, params);
                    if (subscribers[len].once) {
                        _this.unsubscribe(subscribers[len].token);
                    }
                }
            });
        };
        PubSubServiceBase.prototype.unsubscribe = function (token) {
            for (var prop in this.topics) {
                if (this.topics.hasOwnProperty(prop) && this.topics[prop]) {
                    var len = this.topics[prop].length;
                    while (len) {
                        len -= 1;
                        this.topics[prop].splice(len, 1);
                    }
                }
            }
        };
        PubSubServiceBase.prototype.hasTopic = function (callbackId) {
            return !!this.topics[callbackId];
        };
        return PubSubServiceBase;
    }());
    Shared.PubSubServiceBase = PubSubServiceBase;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function DatePickerDirective() {
        return {
            scope: {
                date: "=",
                showNowButton: "=",
                disabled: "="
            },
            templateUrl: '/shared/directives/DatePickerTemplate.html',
            controller: 'DatePickerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.DatePickerDirective = DatePickerDirective;
    var DatePickerController = (function () {
        function DatePickerController($element, $timeout, dateTimeService) {
            var _this = this;
            this.$element = $element;
            this.$timeout = $timeout;
            this.dateTimeService = dateTimeService;
            this.format = 'MMMM dd, yyyy';
            this.hstep = 1;
            this.mstep = 1;
            this.datePickerOpened = false;
            this.timePickerOpened = false;
            this.dateOptions = {
                minDate: new Date(2015, 4, 1),
                maxDate: new Date(),
                showWeeks: false,
                startingDay: 0
            };
            $timeout(function () {
                _this.resizeTimePickerDropdown();
            }, 0);
        }
        Object.defineProperty(DatePickerController.prototype, "prettyDate", {
            get: function () {
                return this.dateTimeService.beautifyDate(this.date, true);
            },
            enumerable: true,
            configurable: true
        });
        DatePickerController.prototype.openDatePicker = function () {
            this.datePickerOpened = !this.datePickerOpened;
        };
        DatePickerController.prototype.openTimePicker = function () {
            this.timePickerOpened = !this.timePickerOpened;
            if (this.timePickerOpened) {
                this.resizeTimePickerDropdown();
            }
        };
        DatePickerController.prototype.resizeTimePickerDropdown = function () {
            var buttonWidth = this.$element.find("#time-picker-toggle").outerWidth();
            var dropdownMinWidth = parseInt(this.$element.find("#time-picker-dropdown").css("min-width"), 10);
            var dropdownWidth = this.$element.find("#time-picker-dropdown").width();
            if (dropdownWidth !== buttonWidth) {
                var newWidth = buttonWidth > dropdownMinWidth ? buttonWidth : dropdownMinWidth;
                this.$element.find("#time-picker-dropdown").width(newWidth);
            }
        };
        DatePickerController.prototype.withLeadingZero = function (value) {
            return value < 10 ? "0" + value : "" + value;
        };
        DatePickerController.prototype.useCurrentTime = function () {
            this.date = new Date();
        };
        DatePickerController.$inject = ['$element', '$timeout', 'dateTimeService'];
        return DatePickerController;
    }());
    Shared.DatePickerController = DatePickerController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function GameCardDirective() {
        return {
            scope: {
                game: "=",
                showModifyButtons: "=",
                reload: "&"
            },
            templateUrl: '/shared/directives/GameCardTemplate.html',
            controller: 'GameCardController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.GameCardDirective = GameCardDirective;
    var State;
    (function (State) {
        State[State["Ready"] = 0] = "Ready";
        State[State["DeleteWarning"] = 1] = "DeleteWarning";
        State[State["Deleting"] = 2] = "Deleting";
        State[State["Deleted"] = 3] = "Deleted";
        State[State["Copy"] = 4] = "Copy";
        State[State["Error"] = 5] = "Error";
    })(State || (State = {}));
    var GameCardController = (function () {
        function GameCardController($http, $window, apiService) {
            this.$http = $http;
            this.$window = $window;
            this.apiService = apiService;
            this.showOverlay = false;
            this.showLoadBar = false;
            this.showDeleteWarning = false;
            this.showDeleted = false;
            this.showError = false;
            this.changeState(State.Ready);
        }
        GameCardController.prototype.changeState = function (newState) {
            this.showOverlay = newState !== State.Ready;
            this.showLoadBar = newState === State.Deleting || newState === State.Copy;
            this.showDeleteWarning = newState === State.DeleteWarning;
            this.showError = newState === State.Error;
            this.showDeleted = newState === State.Deleted;
            switch (newState) {
                case State.Ready:
                    break;
                case State.Copy:
                    this.copy();
                    break;
                case State.Deleting:
                    this.delete();
                    break;
            }
        };
        GameCardController.prototype.errorHandler = function (data, errorMessage) {
            this.errorMessage = errorMessage;
            console.error(data);
            this.changeState(State.Error);
        };
        GameCardController.prototype.delete = function () {
            var _this = this;
            this.apiService.deleteActiveGame(this.game.getIdAsPath()).then(function () {
                _this.changeState(State.Deleted);
            }, function (data) {
                _this.errorHandler(data, 'Error deleting game!');
            });
        };
        GameCardController.prototype.copy = function () {
            var _this = this;
            var newGame = new Shared.Game();
            newGame.players = this.game.players.map(function (player) {
                var gamePlayer = new Shared.GamePlayer();
                gamePlayer.player = player.player;
                return gamePlayer;
            });
            this.apiService.createActiveGame(newGame).then(function (editUrl) {
                _this.$window.location.href = editUrl;
            }, function (data) {
                _this.errorHandler(data, 'Error copying game!');
            });
        };
        GameCardController.prototype.warnDelete = function () {
            this.changeState(State.DeleteWarning);
        };
        GameCardController.prototype.dismissOverlay = function () {
            this.changeState(State.Ready);
        };
        GameCardController.prototype.deleteGame = function (game) {
            this.changeState(State.Deleting);
        };
        GameCardController.prototype.copyGame = function (game) {
            this.changeState(State.Copy);
        };
        GameCardController.$inject = ['$http', '$window', 'apiService'];
        return GameCardController;
    }());
    Shared.GameCardController = GameCardController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function GlobalNavDirective() {
        return {
            scope: {},
            templateUrl: '/shared/directives/GlobalNavTemplate.html',
            controller: 'GlobalNavController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.GlobalNavDirective = GlobalNavDirective;
    var GlobalNavController = (function () {
        function GlobalNavController() {
            this.sidebarOpen = false;
        }
        GlobalNavController.prototype.closeSidebar = function () {
            if (this.sidebarOpen) {
                this.sidebarOpen = false;
            }
        };
        GlobalNavController.$inject = [];
        return GlobalNavController;
    }());
    Shared.GlobalNavController = GlobalNavController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function LoadSpinnerDirective() {
        return {
            scope: {},
            template: '<div class="load-bar"><img src="/images/loader.gif" width="220" height="19" /></div>',
            controller: 'LoadSpinnerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.LoadSpinnerDirective = LoadSpinnerDirective;
    var LoadSpinnerController = (function () {
        function LoadSpinnerController() {
        }
        LoadSpinnerController.$inject = [];
        return LoadSpinnerController;
    }());
    Shared.LoadSpinnerController = LoadSpinnerController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function MonthYearPickerDirective() {
        return {
            scope: {
                month: "=",
                year: "=",
                disabled: "=?",
                change: "&"
            },
            templateUrl: '/shared/directives/MonthYearPickerTemplate.html',
            controller: 'MonthYearPickerController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.MonthYearPickerDirective = MonthYearPickerDirective;
    var MonthYearPickerController = (function () {
        function MonthYearPickerController(dateTimeService) {
            this.dateTimeService = dateTimeService;
            this.isDisabled = false;
            this.minimumYear = 2015;
            this.disableYear = false;
            this.years = [];
            this.months = [
                { name: 'January', value: 0 },
                { name: 'February', value: 1 },
                { name: 'March', value: 2 },
                { name: 'April', value: 3 },
                { name: 'May', value: 4 },
                { name: 'June', value: 5 },
                { name: 'July', value: 6 },
                { name: 'August', value: 7 },
                { name: 'September', value: 8 },
                { name: 'October', value: 9 },
                { name: 'November', value: 10 },
                { name: 'December', value: 11 }
            ];
            this.init();
        }
        Object.defineProperty(MonthYearPickerController.prototype, "disabled", {
            get: function () {
                return this.isDisabled;
            },
            set: function (value) {
                this.isDisabled = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonthYearPickerController.prototype, "month", {
            get: function () {
                return this.currentMonth === undefined || this.currentMonth === null
                    ? this.dateTimeService.currentMonthValue()
                    : this.currentMonth;
            },
            set: function (value) {
                this.currentMonth = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MonthYearPickerController.prototype, "year", {
            get: function () {
                return this.currentYear === undefined || this.currentYear === null
                    ? this.dateTimeService.currentYear()
                    : this.currentYear;
            },
            set: function (value) {
                this.currentYear = value;
            },
            enumerable: true,
            configurable: true
        });
        MonthYearPickerController.prototype.init = function () {
            this.selectedMonth = this.months[this.currentMonth];
            for (var i = this.minimumYear; i <= this.currentYear; i++) {
                var tempYear = { name: i.toString(), value: i };
                this.years.push(tempYear);
                if (i === this.currentYear) {
                    this.selectedYear = tempYear;
                }
            }
            this.disableYear = this.disableYear || this.years.length <= 1;
        };
        MonthYearPickerController.prototype.updateParams = function () {
            this.month = this.selectedMonth.value;
            this.year = this.selectedYear.value;
            if (this.change !== undefined) {
                this.change();
            }
        };
        MonthYearPickerController.$inject = ['dateTimeService'];
        return MonthYearPickerController;
    }());
    Shared.MonthYearPickerController = MonthYearPickerController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function NumericUpDownDirective($window) {
        var _this = this;
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.on('click', function () {
                    if (!$window.getSelection().toString()) {
                        try {
                            _this.setSelectionRange(0, _this.value.length);
                        }
                        catch (ex) {
                        }
                    }
                });
                element.on('keyup', function (event) {
                    var key = event.which || event.keyCode;
                    if (!event.shiftKey && !event.altKey && !event.ctrlKey &&
                        key >= 48 && key <= 57 ||
                        key >= 96 && key <= 105 ||
                        key == 8 || key == 9 || key == 13 ||
                        key == 35 || key == 36 ||
                        key == 37 || key == 39 ||
                        key == 38 || key == 40 ||
                        key == 46 || key == 45 ||
                        key == 173 || key == 189 || key == 109)
                        return true;
                    return false;
                });
            }
        };
    }
    Shared.NumericUpDownDirective = NumericUpDownDirective;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function PlayerBonusPanelDirective() {
        return {
            scope: {
                numPlayers: "="
            },
            templateUrl: '/shared/directives/PlayerBonusPanelTemplate.html',
            controller: 'PlayerBonusPanelController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerBonusPanelDirective = PlayerBonusPanelDirective;
    var PlayerBonusPanelController = (function () {
        function PlayerBonusPanelController() {
        }
        PlayerBonusPanelController.$inject = [];
        return PlayerBonusPanelController;
    }());
    Shared.PlayerBonusPanelController = PlayerBonusPanelController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function PlayerNametagDirective() {
        return {
            scope: {
                player: '='
            },
            templateUrl: '/shared/directives/PlayerNametagTemplate.html',
            controller: 'PlayerNametagController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerNametagDirective = PlayerNametagDirective;
    var PlayerNametagController = (function () {
        function PlayerNametagController() {
        }
        PlayerNametagController.$inject = [];
        return PlayerNametagController;
    }());
    Shared.PlayerNametagController = PlayerNametagController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function PlayerScoretagDirective() {
        return {
            scope: {
                player: '='
            },
            templateUrl: '/shared/directives/PlayerScoretagTemplate.html',
            controller: 'PlayerScoretagController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerScoretagDirective = PlayerScoretagDirective;
    var PlayerScoretagController = (function () {
        function PlayerScoretagController() {
            var rankArray = !this.player.rank ? 0 : this.player.rank;
            this.rank = new Array(rankArray);
        }
        Object.defineProperty(PlayerScoretagController.prototype, "playerName", {
            get: function () {
                return this.player.player;
            },
            enumerable: true,
            configurable: true
        });
        PlayerScoretagController.$inject = [];
        return PlayerScoretagController;
    }());
    Shared.PlayerScoretagController = PlayerScoretagController;
})(Shared || (Shared = {}));

var Shared;
(function (Shared) {
    function PlayerSelectorDirective() {
        return {
            scope: {
                players: '=',
                onSelected: '&',
                disabled: '='
            },
            templateUrl: '/shared/directives/PlayerSelectorTemplate.html',
            controller: 'PlayerSelectorController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }
    Shared.PlayerSelectorDirective = PlayerSelectorDirective;
    var PlayerSelectorController = (function () {
        function PlayerSelectorController($element, $timeout) {
            this.$element = $element;
            this.$timeout = $timeout;
            this.filter = '';
        }
        PlayerSelectorController.prototype.removeFilter = function () {
            this.filter = '';
        };
        PlayerSelectorController.prototype.selectPlayer = function (item, model, label) {
            this.$element.find("input").focus();
            this.onSelected({ data: item });
            this.removeFilter();
        };
        PlayerSelectorController.$inject = ['$element', '$timeout'];
        return PlayerSelectorController;
    }());
    Shared.PlayerSelectorController = PlayerSelectorController;
})(Shared || (Shared = {}));

var GameCardModule = angular.module('GameCardModule', []);
GameCardModule.controller('GameCardController', Shared.GameCardController);
GameCardModule.directive('gameCard', Shared.GameCardDirective);

var PlayerSelectorModule = angular.module('PlayerSelectorModule', []);
PlayerSelectorModule.filter('playerSelectorFilter', Shared.PlayerSelectorFilter);
PlayerSelectorModule.controller('PlayerSelectorController', Shared.PlayerSelectorController);
PlayerSelectorModule.directive('playerSelector', Shared.PlayerSelectorDirective);

var UxControlsModule = angular.module('UxControlsModule', ['ngAnimate', 'ui.bootstrap']);
UxControlsModule.service('dateTimeService', Shared.DateTimeService);
UxControlsModule.service('monthYearQueryService', Shared.MonthYearQueryService);
UxControlsModule.service('apiService', Shared.ApiService);
UxControlsModule.controller('LoadSpinnerController', Shared.LoadSpinnerController);
UxControlsModule.directive('loadSpinner', Shared.LoadSpinnerDirective);
UxControlsModule.controller('DatePickerController', Shared.DatePickerController);
UxControlsModule.directive('datePicker', Shared.DatePickerDirective);
UxControlsModule.controller('MonthYearPickerController', Shared.MonthYearPickerController);
UxControlsModule.directive('monthYearPicker', Shared.MonthYearPickerDirective);
UxControlsModule.controller('PlayerNametagController', Shared.PlayerNametagController);
UxControlsModule.directive('playerNametag', Shared.PlayerNametagDirective);
UxControlsModule.controller('PlayerScoretagController', Shared.PlayerScoretagController);
UxControlsModule.directive('playerScoretag', Shared.PlayerScoretagDirective);
UxControlsModule.controller('GlobalNavController', Shared.GlobalNavController);
UxControlsModule.directive('globalNav', Shared.GlobalNavDirective);
UxControlsModule.directive('numericUpDown', Shared.NumericUpDownDirective);

//# sourceMappingURL=maps/shared.js.map