const mongoose = require('mongoose');

/**
 * Group Schema
 */
const GroupSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    companyId: { type: String },
    departmentName: {
        type: String, trim: true
    },
    dateOFCreation: {
        type: Date,
        default: Date.now
    },
    AgentId: {
        type: String, trim: true
    },
    VisitorId: {
        type: Array
    }
},
    {
        versionKey: false
    });

/**
* @typedef Group
*/
module.exports = mongoose.model('group', GroupSchema);