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
  nickname: { type: String, default: '' },
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

});

/**
 * Register
 */

module.exports = mongoose.model('Player', PlayerSchema);