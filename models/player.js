/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Player schema
 */

var PlayerSchema = new Schema({
  firstName: { type: String, default: '', required: true},
  lastName: { type: String, default: '', required: true},
  nickname: { type: String, default: '' }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

PlayerSchema.method({
  getDisplayName: function() {
    if(this.nickname && this.nickname.length > 0) {
      return this.nickname;
    }
    return this.getFullName();
  },

  getFullName: function() {
    return this.firstName.concat(" ", this.lastName);
  },

  getAbbreviatedName: function() {
    return this.firstName.charAt(0).concat(this.lastName.charAt(0));
  }
});

/**
 * Statics
 */

PlayerSchema.static({
  SortTypes: {
    Alphabetical : 0,
    Rating: 1,
    Board: 2, // sort order that is used for the white board.
    Salty: 3 // Reverse Board sort.
  },

  arrContains: function(playerArr, player) {
    if(!playerArr || !player) {
      return false;
    }
    for(var i=0; i<playerArr.length; i++) {
      if(playerArr[i]._id == player.id) {
        return true;
      }
    }
    return false;
  },

  getEmptyRankedPlayerObject: function(player) {
    return {
      player: player ? player : {},
      totalPoints: 0,
      gamesPlayed: 0,
      rating: 0
    };
  },

  /**
   * Check if an array of Ranked Players contains a Player
   * @param rankedPlayerArr
   * @param player
   * @returns {boolean} True if it contains the player, false if not.
   */
  rankedArrContains: function(rankedPlayerArr, player) {
    if(!rankedPlayerArr || !player) {
      return false;
    }
    for(var i=0; i<rankedPlayerArr.length; i++) {
      if(rankedPlayerArr[i].player.id == player.id) {
        return true;
      }
    }
    return false;
  },

  getRankedPlayerAverage: function(rankedPlayer) {
    return rankedPlayer.totalPoints / rankedPlayer.gamesPlayed;
  },

  /**
   *
   * @param rankedPlayers
   * @param sortType
   */
  rankedPlayerSort: function(rankedPlayers, sortType) {
    var sTypes = PlayerSchema.statics.SortTypes;
    if(!sortType) {
      sortType = sTypes.Rating
    }

    if(sortType == sTypes.Alphabetical) {
      // do this at some point
    } else if(sortType == sTypes.Rating) {
      PlayerSchema.statics.rankedPlayerSortByRating(rankedPlayers);
    } else if(sortType == sTypes.Board) {
      // sort by rating first
      PlayerSchema.statics.rankedPlayerSortByRating(rankedPlayers);
      // then put in game order.
      PlayerSchema.statics.rankedPlayerSortForGame(rankedPlayers);
    } else if(sortType == sTypes.Salty) {
      // do this at some point
    }
  },

  rankedPlayerSortByRating: function(rankedPlayers) {
    rankedPlayers.sort(function (a, b) {
      return PlayerSchema.statics.compareGamePlayerRating(a,b);
    });
  },

  rankedPlayerSortForGame: function(rankedPlayers) {
    var copy = rankedPlayers.slice(0);
    for(var i=1; i<copy.length; i++) {
      var newIndex = Math.floor(i/2);
      if(i%2 == 1) {
        // even rank (odd index)
        rankedPlayers[rankedPlayers.length - 1 - newIndex] = copy[i];
      } else {
        //odd rank (even index)
        rankedPlayers[newIndex] = copy[i];
      }
    }
  },
  
  /**
   * Given two ranked players, compare their average.
   * bAvg - aAvg
   */
  compareGamePlayerRating: function(rankedPlayerA, rankedPlayerB) {
      var aAvg = PlayerSchema.statics.getRankedPlayerAverage(rankedPlayerA);
      var bAvg = PlayerSchema.statics.getRankedPlayerAverage(rankedPlayerB);
      return bAvg - aAvg;
  },

  isSortTypeValid: function(sortType) {
    return sortType == PlayerSchema.statics.SortTypes.Alphabetical ||
        sortType == PlayerSchema.statics.SortTypes.Board ||
        sortType == PlayerSchema.statics.SortTypes.Rating ||
        sortType == PlayerSchema.statics.SortTypes.Salty;
  }
});

/**
 * Register
 */

module.exports = mongoose.model('Player', PlayerSchema);