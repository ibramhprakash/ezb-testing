const mongoose = require("mongoose");

const Chat = require("../models/chat");
const Visitor = require("../models/visitor");

/**
* resister vistor and return visitorId 
* @param req
* @param res
* @param next
* @property {string} req.body.visitorId  - visitorId
* @returns {data,message,status}
*/
function visitor_chats(req, res, next) {
    console.log(req.body.visitorId)
    Visitor.findOne({
        _id: req.body.visitorId,
        user_agent: req.get('User-Agent'),
        host: req.headers.host,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    })
        .then(visitor => {
            if (visitor) {
                Chat.findOne({ visitorId: visitor._id },
                    { conversation: { $slice: -4 } })
                    .exec()
                    .then(chat => {
                        if (chat) {
                            return res.status(200).json({
                                data: {
                                    conversation: chat.conversation
                                },
                                message: "chats",
                                status: true
                            });
                        } else {
                            return res.status(200).json({
                                data: {
                                    conversation: []
                                },
                                message: "No chats avilables",
                                status: true
                            });


                        }
                    })
                    .catch(error => {
                        res.status(200).json({
                            message: error,
                            status: false
                        });
                    });
            } else {
                res.status(200).json({
                    message: "Invalid Visitor",
                    status: false
                });
            }
        }).catch(error => {
            console.log(error)
            res.status(200).json({
                message: error,
                status: false
            });
        });

};




module.exports = { visitor_chats };