const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Company = require("../models/company");
const Visitor = require("../models/visitor");

/**
* resister visitor and return visitorId 
* @param req
* @param res
* @param next
* @property {string} req.body.companyId  - companyId
* @property {string} req.headers.host  - hostname
* @property {string} req.headers.remoteAddress  - hostname
* @property {string}  req.get["User-Agent"]  - browser
* @returns {data,message,status}
*/
function visitor_enroll(req, res, next) {
    console.log(req.body);
    Company.findOne({ _id: req.body.companyId })
        .exec()
        .then(company => {
            if (company) {
                Visitor.findOne({
                    companyId: req.body.companyId, user_agent: req.get('User-Agent'),
                    host: req.headers.host,
                    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
                })
                    .exec()
                    .then(reslt => {
                        if (!reslt) {
                            const visitor = new Visitor({
                                _id: new mongoose.Types.ObjectId(),
                                companyId: req.body.companyId,
                                companyName: company.name,
                                user_agent: req.get('User-Agent'),
                                host: req.headers.host,
                                ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                                dateOFJoin: new Date(),
                                timeZone: req.body.timeZone,
                                locale: req.body.locale
                            });
                            visitor
                                .save()
                                .then(result => {
                                    res.status(200).json({
                                        data: {
                                            visitorId: result._id,
                                            visitorStatus: "fresh"
                                        },
                                        message: "visitor registered",
                                        status: true
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(200).json({
                                        data: {
                                            message: err,
                                            status: false
                                        }
                                    });
                                });
                        } else {
                            Visitor.updateOne({ _id: reslt._id }, { $set: { timeZone: req.body.timeZone, locale: req.body.locale } })
                                .then()
                                .catch(error => {
                                    console.log(error);
                                });
                            res.status(200).json({
                                data: {
                                    visitorId: reslt._id,
                                    visitorStatus: "returning",
                                },
                                message: "visitor allready registered",
                                status: true

                            });
                        }

                    });
            } else {
                res.status(200).json({
                    data: {
                        result: company._id,
                    },
                    message: "invalid company",
                    status: false

                });
            }
        }).catch(err => {
            res.status(200).json({
                message: err,
                status: false
            });
        });

};




module.exports = { visitor_enroll };