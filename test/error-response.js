/*jslint indent: 2*/
/*global require: true, module: true, describe: true, it: true, setTimeout: true*/

(function () {

  'use strict';

  var should = require('should'),
    express = require('express'),
    supertest = require('supertest'),
    cors = require('../lib'),
    app;

  /* -------------------------------------------------------------------------- */

  app = express();
  app.use(cors());

  /*jslint unparam: true*/ // `req` is part of the signature, but not used in these routes
  app.post('/five-hundred', function (req, res, next) {
    next(new Error('nope'));
  });
  /*jslint unparam: false*/

  /*jslint unparam: true*/ // `req` is part of the signature, but not used in these routes
  app.post('/four-oh-one', function (req, res, next) {
    next(new Error('401'));
  });
  /*jslint unparam: false*/

  /*jslint unparam: true*/ // `req` is part of the signature, but not used in these routes
  app.post('/four-oh-four', function (req, res, next) {
    next();
  });
  /*jslint unparam: false*/

  /*jslint unparam: true*/ // `req` is part of the signature, but not used in these routes
  app.use(function (err, req, res, next) {
    if (err.message === '401') {
      res.send(401, 'unauthorized');
    } else {
      next(err);
    }
  });
  /*jslint unparam: false*/

  /* -------------------------------------------------------------------------- */

  describe('error response', function () {
    it('500', function (done) {
      supertest(app)
        .post('/five-hundred')
        .expect(500)
        .end(function (err, res) {
          should.not.exist(err);
          res.headers['access-control-allow-origin'].should.eql('*');
          res.text.should.startWith('Error: nope');
          done();
        });
    });

    it('401', function (done) {
      supertest(app)
        .post('/four-oh-one')
        .expect(401)
        .end(function (err, res) {
          should.not.exist(err);
          res.headers['access-control-allow-origin'].should.eql('*');
          res.text.should.eql('unauthorized');
          done();
        });
    });

    it('404', function (done) {
      supertest(app)
        .post('/four-oh-four')
        .expect(404)
        .end(function (err, res) {
          should.not.exist(err);
          res.headers['access-control-allow-origin'].should.eql('*');
          done();
        });
    });
  });

}());

