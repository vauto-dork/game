/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Game schema
 */

var GameSchema = new Schema({
  winner: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
  datePlayed: { type: Date, default: Date.now, required: true },
  players: [{
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
    points: { type: Number, default: 0 },
    rank: { type: Number, default: 0 }
  }]
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

GameSchema.method({

});

/**
 * Statics
 */

GameSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Game', GameSchema);