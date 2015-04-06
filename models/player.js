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