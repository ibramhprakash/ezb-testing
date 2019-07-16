const mongoose = require('mongoose');

/**
 * Visitor Schema
 */
const VisitorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: { type: String, trim: true },
    companyName: { type: String, trim: true },
    ip: { type: String, trim: true },
    user_agent: { type: String, trim: true },
    host: { type: String, trim: true },
    dateOFJoin: {
        type: Date,
        default: new Date()
    },
    name: { type: String, trim: true },
    timeZone: { type: Number },
    location: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    subscribe: { type: Boolean },
    locale: { type: String },
    visitCount: { type: Number }
},
    {
        versionKey: false
    });

/**
* @typedef Visitor
*/
module.exports = mongoose.model('visitor', VisitorSchema);