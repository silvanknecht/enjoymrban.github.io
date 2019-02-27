const express = require('express');
//const router = require('express-promise-router');
const router = express.Router();

// import controllers
const MailController = require('../controllers/MailController');


router.post('/', (req, res, next) =>{
    MailController.send(req, res);
});

module.exports = router;
