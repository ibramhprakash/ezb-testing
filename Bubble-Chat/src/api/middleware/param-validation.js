const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


const company_resistration = Joi.object().keys({
    email: Joi.string().regex(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/).email().required(),
    name: Joi.string().required(),
    site: Joi.string().required(),
    location: Joi.string().required(),
    description: Joi.string().required()

});

const company_Infomation = Joi.object().keys({
    companyId: Joi.objectId().required(),

});

const visitor_enroll = Joi.object().keys({
    companyId: Joi.objectId().required(),
    timeZone: Joi.number().required(),
    locale: Joi.string().required()

});

const visitor_chats = Joi.object().keys({
    visitorId: Joi.objectId().required()

})
const company_assignAgent = Joi.object().keys({
    companyId: Joi.objectId().required(),
    agentId: Joi.string().required()

})
const company_messageSenderAgent = Joi.object().keys({
    companyId: Joi.objectId().required(),
    agentName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()

});



module.exports = {

    // POST /company/resgister
    company_resistration: (req, res, next) => {
        company_resistration.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
            .then(validatedUser => {
                next();
            })
            .catch(validationError => {
                const errorMessage = validationError.details.map(d => d.message);
                const error = new Error(errorMessage);
                error.status = 200;
                next(error);
            });
    },
    // POST /company/
    company_Infomation: (req, res, next) => {
        company_Infomation.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
            .then(validatedUser => {
                next();
            })
            .catch(validationError => {
                const errorMessage = validationError.details.map(d => d.message);
                const error = new Error(errorMessage);
                error.status = 200;
                next(error);
            });
    },
    //post/visitor/resgister
    visitor_enroll: (req, res, next) => {
        visitor_enroll.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
            .then(validatedUser => {
                next();
            })
            .catch(validationError => {
                const errorMessage = validationError.details.map(d => d.message);
                const error = new Error(errorMessage);
                error.status = 200;
                next(error);
            });
    },
    //post/visitor/chat
    visitor_chats: (req, res, next) => {
        visitor_chats.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
            .then(validatedUser => {
                next();
            })
            .catch(validationError => {
                const errorMessage = validationError.details.map(d => d.message);
                const error = new Error(errorMessage);
                error.status = 200;
                next(error);
            });
    },
    // POST /company/assignAgent
    company_messageSenderAgent: (req, res, next) => {
        company_messageSenderAgent.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
            .then(validatedUser => {
                next();
            })
            .catch(validationError => {
                const errorMessage = validationError.details.map(d => d.message);
                const error = new Error(errorMessage);
                error.status = 200;
                next(error);
            });
    },
    company_assignAgent: (req, res, next) => {
        company_assignAgent.validate(req.body, { abortEarly: false }) //abortEarly - collect all errors not just the first one
            .then(validatedUser => {
                next();
            })
            .catch(validationError => {
                const errorMessage = validationError.details.map(d => d.message);
                const error = new Error(errorMessage);
                error.status = 200;
                next(error);
            });
    }

}