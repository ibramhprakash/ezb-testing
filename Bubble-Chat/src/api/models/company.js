const mongoose = require('mongoose');

/**
 * Company Schema
 */
const CompanySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    dateOFJoin: {
        type: Date,
        default: Date.now
    },
    defaultAgent: {
        type: String
    },
    groupId: {
        type: Array
    },
    agents: { type: Array },
    name: { type: String, trim: true },
    site: { type: String, trim: true },
    apiKey: { type: String, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true }
},
    {
        versionKey: false
    });

/**
* @typedef Company
*/
module.exports = mongoose.model('company', CompanySchema);