const { validateRttParams } = require('./Middlewares/Validators');

const app = require('express')();
require('dotenv').config();

// List of public holidays in a year in France
const publicHolidays = [
    { day: 1, month: 1 },
    { day: 13, month: 4 },
    { day: 1, month: 5 },
    { day: 8, month: 5 },
    { day: 21, month: 5 },
    { day: 14, month: 7 },
    { day: 15, month: 8 },
    { day: 1, month: 11 },
    { day: 11, month: 11 },
    { day: 25, month: 12 },
];

// Check if the year is a leap year
const isLeapYear = (year) =>
    year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);

// Count the number of weekend days in a year
const countWeekend = (nbDays, dayOfWeek) => {
    if (nbDays === 365) return dayOfWeek === 6 || dayOfWeek === 7 ? 105 : 104;
    if (nbDays === 366)
        return dayOfWeek === 6 ? 106 : dayOfWeek === 7 ? 105 : 104;
};

// Count the number of public holidays (that is not in the weekend) in a year
const countPublicHolidays = (year) => {
    // Init to 1 for Pantecote
    let nbPublicHolidays = 1;

    publicHolidays.forEach((elem) => {
        let dayOfWeek = new Date(year, elem.month - 1, elem.day).getDay();
        if (dayOfWeek !== 6 && dayOfWeek !== 7) nbPublicHolidays++;
    });
    return nbPublicHolidays;
};

app.get('/', validateRttParams, async (req, res) => {
    const { year, workedDays, restedDays } = req.query;
    let date = new Date(year);
    let nbDays = isLeapYear(+year) ? 366 : 365;

    nbDays -= countWeekend(nbDays, date.getDay());
    nbDays -= countPublicHolidays(date.getDay());
    nbDays -= restedDays;
    nbDays -= workedDays;
    return res.json({ rtt: nbDays > 0 ? nbDays : 0 }).send();
});

// Error handling
app.use((err, _req, res, _next) => {
    console.error('Error', err);
    res.sendStatus(500);
});

if (process.env.NODE_ENV !== 'test') {
    // Launch the server
    app.listen(process.env.PORT ?? 3000, () =>
        console.log(
            `App listening at http://localhost:${process.env.PORT ?? 3000}`
        )
    );
}

module.exports = app;
