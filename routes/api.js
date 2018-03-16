const CHEERIO = require('cheerio');
const DB = require('../models');
const request = require('request');
var AXIOS = require('axios');


let pageNumber = 0;

module.exports = function(APP, firebaseInstance) {
  pageNumber++;
  APP.get('/api/scrape', function(req, res) {
    AXIOS.get(`https://www.smashingmagazine.com/articles/`)
        .then(function(response) {
          const $ = CHEERIO.load(response.data);
          let headlines = [];
          const articleLength = $('.article--post').length;
          $('.article--post').each(function(index, element) {
            const result = {};
            result.title = $(this).find('.article--post__title a').text();
            result.link = 'https://www.smashingmagazine.com' +
                $(this).find('.article--post__title a').attr('href');
            let description =
                $($(this).find('.article--post__teaser')[0]).text();
            description =
                description.replace(/\n/g, '').replace(/\t/g, '').replace(
                    'Read More…', '');
            description = description.substr(description.indexOf('—') + 1);
            result.description = description;

            DB.Headline.create(result)
                .then(function(headline) {
                  headlines.push(headline);
                  if (index === articleLength - 1) {
                    res.send({message: `Scraping completed! ${articleLength} articles are added.`});
                  }
                })
                .catch(function(err) {
                  res.status(500).send(err);
                });
          });
        });
  });

  APP.get('/api/headlines', function(req, res) {
    DB.Headline.find({})
        .then(function(headlines) {
          res.json(headlines);
        })
        .catch(function(err) {
          res.json(err);
        });
  });

  APP.get('/articles/:id', function(req, res) {
    DB.Headline.findOne({_id: req.params.id})
        .populate('note')
        .then(function(headline) {
          res.json(headline);
        })
        .catch(function(err) {
          res.json(err);
        });
  });

  APP.post('/articles/:id', function(req, res) {
    DB.Note.create(req.body)
        .then(function(dbNote) {
          return DB.Headline.findOneAndUpdate(
              {_id: req.params.id}, {note: dbNote._id}, {new: true});
        })
        .then(function(headline) {
          res.json(headline);
        })
        .catch(function(err) {
          res.json(err);
        });
  });
};
