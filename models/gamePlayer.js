/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * GamePlayerSchema schema
 */

var GamePlayerSchema = new Schema({
  game: { type: Schema.Types.ObjectId, ref: 'Game', required: true},	
  player: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
  points: { type: Number, default: 0 },
  place: { type: Number, default: 0 },
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

GamePlayerSchema.method({

});

/**
 * Statics
 */

GamePlayerSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('GamePlayer', GamePlayerSchema);