process.env.NODE_ENV = 'test';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const validDatas = require('../Assets/validDatas');
const invalidDatas = require('../Assets/invalidDatas');
chai.should();
chai.use(chaiHttp);

describe('\n\nCheck count of RTT', () => {
    validDatas.forEach((data, i) => {
        it(`Test valid data ${i}`, (done) => {
            chai.request(app)
                .get(`/`)
                .query({
                    year: data.year,
                    workedDays: data.workedDays,
                    restedDays: data.restedDays,
                })
                .end((_err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('rtt').eql(data.rtt);
                    done();
                });
        });
    });

    invalidDatas.forEach((data, i) => {
        it(`Test invalid data ${i}`, (done) => {
            chai.request(app)
                .get(`/`)
                .query({
                    year: data.year,
                    workedDays: data.workedDays,
                    restedDays: data.restedDays,
                })
                .end((_err, res) => {
                    res.should.have.status(400);
                    done();
                });
        });
    });
});
