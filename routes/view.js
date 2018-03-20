const db = require('../models');
const request = require('request');

module.exports = function(APP) {
  APP.get('/', function(req, res) {
    request.get(
        `http://${req.headers.host}/api/headlines`, function(err, resp, headlines) {
          if (!err) {
            res.render('home', {headlines: JSON.parse(headlines)});
          } else {
            res.status(500).send({error: 'Internal Server Error'});
          }
        });
  });


  APP.get('/scrape', function(req, res) {
    request.get(
        `http://${req.headers.host}/api/scrape`, function(err, resp, body) {
          if (!err) {
            res.status(200).send(body);
          } else {
            res.status(500).send({error: 'Internal Server Error'});
          }
        });
  });

  APP.get('/saved', function(req, res) {
    request.get(
      `http://${req.headers.host}/api/headlines/saved`, function(err, resp, headlines) {
        if (!err) {
          res.render('saved', {headlines: JSON.parse(headlines)});
        } else {
          res.status(500).send({error: 'Internal Server Error'});
        }
      });
  });
};