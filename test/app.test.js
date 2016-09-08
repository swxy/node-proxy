/**
 * test app.js
 */

const app = require('../app');
const request = require('supertest');
const assert = require('assert');

describe('test app.js', () => {
    it('should get index.html', (done) => {
        request(app)
            .get('/page/index.html')
            .expect(200, done);
    });
    it('should get default response', (done) => {
        request(app)
            .get('/page/xx.js')
            .expect(200)
            .end((err, res) => {
                assert(res.text === 'Hello Koa');
                done(err);
            })
    })
});
