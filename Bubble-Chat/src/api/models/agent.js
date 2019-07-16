const mongoose = require('mongoose');

/**
 * Agent Schema
 */
const AgentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: { type: String },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    name: {
        type: String, trim: true
    },
    password: {
        type: String
    },
    dateOFJoin: {
        type: Date,
        default: Date.now
    },
    groupId: {
        type: String, trim: true
    },
},
    {
        versionKey: false
    });

/**
* @typedef Agent
*/
module.exports = mongoose.model('agent', AgentSchema);