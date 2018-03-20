const EXPRESS = require('express');
const BODYPARSER = require('body-parser');
const MONGOOSE = require('mongoose');
const PORT = process.env.PORT || 3000;
const APP = EXPRESS();
const EXPHBS = require('express-handlebars');

const HBS = EXPHBS.create({
  defaultLayout: 'main'
});

APP.engine('handlebars', HBS.engine);
APP.set('view engine', 'handlebars');

APP.use(BODYPARSER.urlencoded({extended: true}));
APP.use(EXPRESS.static('public'));

MONGOOSE.Promise = Promise;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
MONGOOSE.connect(MONGODB_URI);

require('./routes/api')(APP);
require('./routes/view')(APP);

APP.use(function (err, req, res, next) {
  res.render('servererror');
})

APP.listen(PORT, function() {
  console.log('APP running on port ' + PORT + '!');
});


