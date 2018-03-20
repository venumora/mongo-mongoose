const CHEERIO = require('cheerio');
const DB = require('../models');
const request = require('request');
const AXIOS = require('axios');
const ObjectId = require('mongodb').ObjectID;


let pageNumber = 0;

module.exports = function (APP, firebaseInstance) {
  pageNumber++;
  APP.get('/api/scrape', function (req, res) {
    AXIOS.get(`https://www.smashingmagazine.com/articles/`)
      .then(function (response) {
        const $ = CHEERIO.load(response.data);
        let headlines = [];
        const articleLength = $('.article--post').length;
        $('.article--post').each(function (index, element) {
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
            .then(function (headline) {
              headlines.push(headline);
              if (index === articleLength - 1) {
                res.send({ message: `Scraping completed! ${articleLength} articles are added.` });
              }
            })
            .catch(function (err) {
              res.status(500).send(err);
            });
        });
      });
  });

  APP.get('/api/headlines', function (req, res) {
    DB.Headline.find({})
      .then(function (headlines) {
        res.json(headlines);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  APP.get('/api/headlines/saved', function (req, res) {
    DB.Headline.find({ saved: true })
      .populate('notes')
      .then(function (headlines) {
        res.json(headlines);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  APP.get('/api/saveheadline/:id', function (req, res) {
    DB.Headline.update({ _id: req.params.id }, { $set: { saved: true } })
      .then(function (headline) {
        res.redirect('/');
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  APP.get('/api/unsaveheadline/:id', function (req, res) {
    DB.Headline.update({ _id: req.params.id }, { $set: { saved: false } })
      .then(function (headline) {
        res.redirect('/saved');
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  APP.post('/api/savenote/:id', function (req, res) {
    DB.Note.create(req.body)
      .then(function (dbNote) {
        console.log(dbNote);
        return DB.Headline.findOneAndUpdate(
          { _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
      })
      .then(function (headline) {
        res.redirect('/saved');
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  APP.get('/api/deletenote/:id/:noteid', function (req, res) {
    DB.Note.remove({ _id: req.params.noteid })
      .then(function (dbNote) {
        DB.Headline.update({ _id: req.params.id }, { $pull: { notes: ObjectId(req.params.noteid) } })
          .then(function (headline) {
            res.redirect('/saved');
          })
          .catch(function (err) {
            res.json(err);
          });
      })
      .catch(function (err) {
        res.json(err);
      });
  });
};
