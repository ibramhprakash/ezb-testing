const mongoose = require('mongoose');

/**
 * Counter Schema
 */
const CounterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    totaluserAgent: { type: String },
    id: { type: Number }
},
    {
        versionKey: false
    });

/**
* @typedef counter
*/
module.exports = mongoose.model('couter', CounterSchema);