const mongoose = require("mongoose");

const Visitor = require('../api/models/visitor');
const Chat = require('../api/models/chat');
const Company = require('../api/models/company');

const welcomeMessage = "Welcome to our ezButler, if you need help simply reply to this message, we are online and ready to help.";
const defaultMessage = "sorry did not understand !!!!"
class socketEstablish {

    constructor(socket, io) {
        //SOCKET  Connect in this point and join sid in room and send default message and status online
        socket.on('connected', function (receive) {
            console.log(receive)
            if (receive.visitorId) {
                Visitor.findOne({
                    _id: receive.visitorId
                })
                    .exec()
                    .then(visitor => {
                        if (visitor) {
                            let sendata = {}, conversation = {}, sendMessageId = new mongoose.Types.ObjectId();
                            socket.join(receive.visitorId);
                            Visitor.findOneAndUpdate({
                                _id: receive.visitorId
                            }, {
                                    $inc: { visitCount: 1 }
                                })
                                .then()
                                .catch();
                            Company.findOne({
                                _id: visitor.companyId,
                                senderMessageAgent: { $elemMatch: { senderId: visitor.companyId } }
                            })
                                .then(company => {
                                    if (!company) {
                                        Company.updateOne({ _id: visitor.companyId },
                                            {
                                                $push: { senderMessageAgent: { senderId: visitor.companyId, senderName: visitor.companyName } },
                                                // $set: { assingedAgentId: visitor.companyId }
                                            })
                                            .then()
                                            .catch();
                                    }
                                })
                                .catch();
                            Chat.findOne({ companyId: visitor.companyId, visitorId: receive.visitorId })
                                .exec()
                                .then(chatresult => {
                                    if (!chatresult) {
                                        sendata = {
                                            send: {
                                                messageId: sendMessageId,
                                                message: welcomeMessage,
                                                senderId: visitor.companyId,
                                                seen: false,
                                                date: new Date
                                            }
                                        }
                                        conversation = sendata
                                        const chat = new Chat({
                                            _id: new mongoose.Types.ObjectId(),
                                            companyId: visitor.companyId,
                                            visitorId: visitor._id,
                                            conversation: [conversation],
                                            lastUpdate: receive.date || new Date(),
                                        });
                                        chat
                                            .save()
                                            .then(result => {
                                                sendata['status'] = "online";
                                                socket.emit('newMessage', sendata);
                                            })
                                            .catch(error => {
                                                console.log(error);
                                                socket.disconnect();
                                            })
                                    }
                                });
                        } else {
                            socket.disconnect();
                        }
                    })
                    .catch(error => {
                        socket.disconnect();
                    })
            } else {
                socket.disconnect();
            }

        });

        // sendMessage is recevie message via chatbubble and reflect to the other corrosponding visitors
        socket.on('sendMessage', function (receive) {
            console.log(receive)
            if (receive.visitorId) {
                Visitor.findOne({
                    _id: receive.visitorId
                })
                    .exec()
                    .then(visitor => {
                        if (visitor) {
                            Chat.findOne({ companyId: visitor.companyId, visitorId: receive.visitorId },
                                { conversation: { $slice: -1 }, _id: 1 })
                                .exec()
                                .then(chatresult => {
                                    if (chatresult) {
                                        let sendata = {}, updatequery = {}, recevieMessageId = new mongoose.Types.ObjectId(), sendMessageId = '',
                                            recevie = {}, send = {}, sendRecevie = {}, sendResponse = {};
                                        recevie = {
                                            messageId: recevieMessageId,
                                            message: receive.message,
                                            senderId: visitor.visitorId,
                                            seen: false,
                                            date: new Date
                                        }
                                        if ('recevie' in chatresult.conversation[0]) {
                                            sendMessageId = new mongoose.Types.ObjectId();

                                            send = { messageId: sendMessageId, message: defaultMessage, seen: false, date: new Date }

                                            updatequery = {
                                                $push: {
                                                    conversation: {
                                                        recevie, send
                                                    }
                                                }, $set: { lastUpdate: receive.date || new Date() }
                                            }
                                            Chat.updateOne({ _id: chatresult._id },
                                                updatequery, { upsert: true })
                                                .then(chatupdate => {
                                                    console.log(chatupdate)
                                                    sendRecevie['recevie'] = recevie;
                                                    // io.sockets.in(receive.visitorId).emit('newMessage', sendata);
                                                    socket.broadcast.in(receive.visitorId).emit('newMessage', sendRecevie);
                                                    sendResponse['send'] = send;
                                                    io.sockets.in(receive.visitorId).emit('newMessage', sendResponse);
                                                    console.log("test")
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                })
                                        } else {
                                            updatequery = { $set: { "conversation.$.recevie": { messageId: new mongoose.Types.ObjectId(), message: receive.message, date: new Date } }, lastUpdate: receive.date || new Date() }
                                            Chat.updateOne({ _id: chatresult._id, conversation: { $elemMatch: { 'send.messageId': chatresult.conversation[0].send.messageId } } },
                                                updatequery, { upsert: true })
                                                .then(chatupdate => {
                                                    console.log(chatupdate)
                                                    // socket.to('receive.visitorId').emit('newMessage', sendata);
                                                    // io.sockets.in(receive.visitorId).emit('newMessage', sendata);
                                                    sendRecevie['recevie'] = recevie;
                                                    socket.broadcast.in(receive.visitorId).emit('newMessage', sendRecevie);
                                                })
                                                .catch(error => {
                                                    console.log(error);
                                                })
                                        }
                                    }
                                }).catch(error => {
                                    console.log(error)
                                })
                        } else {
                            socket.disconnect();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        socket.disconnect();
                    })
            } else {
                socket.disconnect();
            }
        });


        // logout is for disconnect visitor to our end and send status offline 
        socket.on('logout', function (data) {
            console.log(receive)
            if (visitor(receive.visitorId)) {
                let sendata = {};
                socket.leave(receive.visitorId);
                sendata = {
                    status: "offline"
                }
                socket.emit('newMessage', sendata);
                socket.disconnect();
            } else {
                socket.disconnect();
            }
        });

        //getAction is for get action from visitor side (message seen, typing On, typing Off) actions 
        socket.on('getAction', function (receive) {
            console.log(receive)
            if (visitor(receive.visitorId)) {
                let sendResponse = {};
                if (receive.action.toLowerCase() == "typingon") {
                    sendResponse = {
                        message: receive.message,
                        action: receive.action
                    }
                } else if (receive.action.toLowerCase() == "typingoff") {
                    sendResponse = {
                        message: receive.message,
                        action: receive.action
                    }
                } else if (receive.action.toLowerCase() == "seen" && (receive.type.toLowerCase() == "receive" || receive.type.toLowerCase() == "send")) {
                    let type = receive.type.toLowerCase();
                    if (type == "recevie") {
                        updateData = {
                            $set: {
                                "conversation.$.recevie": true
                            }
                        }
                        Chat.updateOne({
                            _id: receive.visitorId,
                            conversation: { $elemMatch: { 'recevie.messageId': receive.messageId } }
                        }, updateData)
                    } else {
                        updateData = {
                            $set: {
                                "conversation.$.send.seen": true
                            }
                        }
                    }
                    Chat.updateOne({
                        _id: receive.visitorId,
                        conversation: { $elemMatch: { 'send.messageId': receive.messageId } }
                    }, updateData)
                }

                sendResponse = {
                    message: receive.message,
                    action: receive.action,
                    status: true
                }

                socket.emit('action', sendResponse);
                socket.disconnect();
            } else {
                socket.disconnect();
            }
        });
    }
}

module.exports = socketEstablish;