const express = require('express');
//const router = require('express-promise-router');
const router = express.Router();

// import controllers
const MailController = require('../controllers/MailController');

// import validation funciton/ schemas
const {
    validateBody,
    schemas
} = require('../helpers/formValidation');


router.post('/',validateBody(schemas.contactSchema), (req, res, next) =>{
    MailController.send(req, res);
});

module.exports = router;
