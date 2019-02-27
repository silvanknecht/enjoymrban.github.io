const Joi = require('joi');

module.exports = {
    // function to validate ...
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);
            if (result.error) {
                return res.status(400).send(result.error);
                //.json(result.error);
            }
            next();
        };
    },

    schemas: {
        contactSchema: Joi.object().keys({
            contactName: Joi.string().required().min(3).max(20),
            contactEmail: Joi.string().email({ minDomainAtoms: 2 }).required(),
            contactMessage: Joi.string().required().min(20).max(500),
            token: Joi.string().required().min(334).max(334)
        })
    }
};