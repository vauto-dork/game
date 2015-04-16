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
      rank: 0
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

  getRankedPlayerAverage: function(gamePlayer) {
    return gamePlayer.totalPoints / gamePlayer.gamesPlayed;
  },

  rankedPlayerSort: function(rankedPlayers) {
    rankedPlayers.sort(function(a,b){
      var aAvg = PlayerSchema.statics.getRankedPlayerAverage(a);
      var bAvg = PlayerSchema.statics.getRankedPlayerAverage(b);
      return bAvg - aAvg;
    });
  }
});

/**
 * Register
 */

module.exports = mongoose.model('Player', PlayerSchema);