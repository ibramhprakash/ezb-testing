const mongoose = require('mongoose');

/**
 * Chat Schema
 */
const ChatSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: { type: String, trim: true },
    visitorId: { type: String, trim: true },
    conversation: [{}],
    lastReceive: {type: Date, trim: true},
    lastSend: {type: Date, trim: true}
},
    {
        versionKey: false
    });

/**
* @typedef Chat
*/
module.exports = mongoose.model('chat', ChatSchema);