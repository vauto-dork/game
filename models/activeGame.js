/*!
 * Module dependencies
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * Active game schema
 */

var ActiveGameSchema = new Schema({
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

ActiveGameSchema.method({

});

/**
 * Statics
 */

ActiveGameSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('ActiveGame', ActiveGameSchema);