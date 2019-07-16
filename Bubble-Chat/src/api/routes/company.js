const express = require("express");
const router = express.Router();

const CompanyController = require('../controllers/company');
const parmvValidation = require('../middleware/param-validation');

router.post("/", parmvValidation.company_Infomation, CompanyController.company_Infomation);
router.post("/register", parmvValidation.company_resistration, CompanyController.company_registration);
router.post("/registerAgent", parmvValidation.company_messageSenderAgent, CompanyController.company_messageSenderAgent);
router.post("/assignAgent", parmvValidation.company_assignAgent, CompanyController.company_assignAgent);



module.exports = router;