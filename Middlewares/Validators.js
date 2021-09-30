const { validationResult, query } = require('express-validator');

const myValidationResult = validationResult.withDefaults({
    formatter: (error) => ({
        msg: error.msg,
    }),
});

exports.validateRttParams = [
    query('year').exists({ checkFalsy: true }).isInt(),
    query('workedDays')
        .exists({ checkFalsy: true })
        .isInt({ min: 0, max: 218 }),
    query('restedDays').exists({ checkFalsy: true }).isInt({ min: 25 }),
    (req, res, next) => {
        try {
            myValidationResult(req).throw();
            next();
        } catch (err) {
            console.error(err.errors);
            res.status(400).send('Invalid params');
        }
    },
];
