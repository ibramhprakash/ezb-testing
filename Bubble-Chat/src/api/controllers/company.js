const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Company = require("../models/company");
const Counter = require("../models/counter");
const Agent = require("../models/agent");

/**
* register vistor and return vistorId 
* @param req
* @param res
* @param next
* @property {string} req.body.companyId  - company name
* @returns {data,message,status}
*/
function company_Infomation(req, res, next) {
    Company.findOne({ _id: req.body.companyId })
        .exec()
        .then(company => {
            if (company) {
                return res.status(200).json({
                    data: {
                        companyId: company._id,
                        email: company.email,
                        name: company.name,
                        site: company.site,
                        API_Key: company.apiKey,
                        defaultAgent: company.defaultAgent,
                        agents: company.agents,
                        groupId: company.groupId,
                        description: company.description,
                        location: company.location,
                        dateOFJoin: company.dateOFJoin
                    },
                    message: "company Info",
                    status: true
                });
            } else {
                return res.status(200).json({
                    message: "Company Invalid",
                    status: false
                });
            }
        });

};

/**
* register vistor and return vistorId 
* @param req
* @param res
* @param next
* @property {string} req.body.name  - company name
* @property {string} req.body.email  - company email
* @returns {data,message,status}
*/
function company_registration(req, res, next) {
    Company.findOne({ email: req.body.email })
        .exec()
        .then(company => {
            if (company) {
                return res.status(200).json({
                    data: {
                        companyId: company._id
                    },
                    message: "company registered allready",
                    status: true
                });
            } else {

                const company = new Company({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    name: req.body.name,
                    site: req.body.site,
                    description: req.body.description,
                    location: req.body.location,
                    dateOFJoin: new Date()
                });
                company
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({
                            message: "company registered",
                            data: {
                                companyId: result._id
                            },
                            status: true
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(200).json({
                            error: err,
                            status: false
                        });
                    });
            }
        });

};

/**
* resister Agent in company doc and return AgentId 
* @param req
* @param res
* @param next
* @property {string} req.body.companyId  - companyId
* @property {string} req.body.agentName  - agent name
* @property {string} req.body.email  - agent email
* @property {string} req.body.password  - agent password
* @returns {data,message,status}
*/
function company_messageSenderAgent(req, res, next) {
    Agent.findOne({ companyId: req.body.companyId, email: req.body.email })
        .exec()
        .then(agent => {
            if (agent) {
                return res.status(200).json({
                    message: "allready created",
                    status: false
                });
            } else {
                let agentId = new mongoose.Types.ObjectId();
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(200).json({
                            message: err
                        });
                    } else {
                        console.log(agentId);
                        const agent = new Agent({
                            _id: agentId,
                            companyId: req.body.companyId,
                            email: req.body.email,
                            name: req.body.agentName,
                            password: hash,
                            dateOFJoin: new Date()
                        });
                        agent
                            .save()

                        Company.updateOne({ _id: req.body.companyId },
                            { $push: { agents: String(agentId) } })
                            .then(compayUpdate => {
                                console.log(compayUpdate);
                                if (compayUpdate.nModified) {
                                    res.status(200).json({
                                        data: {
                                            agentId: agentId
                                        },
                                        message: "company Agent is created",
                                        status: true
                                    });
                                } else {
                                    return res.status(200).json({
                                        message: "Something Went wrong",
                                        status: false
                                    });
                                }
                            })
                            .catch(error => {
                                return res.status(200).json({
                                    message: "Something Went wrong",
                                    status: false
                                });
                            })
                            // })
                            .catch(error => {
                                return res.status(200).json({
                                    message: "Something Went wrong",
                                    status: false
                                });
                            })
                    }
                });

            }
        });
}
/**
* assign agent to message sending process 
* @param req
* @param res
* @param next
* @property {string} req.body.companyId  - company name
* @property {string} req.body.agentId  - company email
* @returns {data,message,status}
*/
function company_assignAgent(req, res, next) {
    Company.findOne({ _id: req.body.companyId, senderMessageAgent: { "$elemMatch": { senderId: req.body.agentId } } })
        .exec()
        .then(company => {
            if (!company) {
                return res.status(200).json({
                    message: "Invalid  AgentId",
                    status: false
                });
            } else {

                Company.updateOne({ _id: req.body.companyId, senderMessageAgent: { "$elemMatch": { senderId: req.body.agentId } } },
                    {
                        $set: { assingedAgentId: req.body.agentId }
                    })
                    .then(companyUpdate => {
                        res.status(200).json({
                            message: "Assigned",
                            status: true
                        });

                    })
                    .catch(error => {
                        res.status(200).json({
                            message: error,
                            status: false
                        });
                    });
            }
        });

}


module.exports = { company_registration, company_messageSenderAgent, company_assignAgent, company_Infomation };