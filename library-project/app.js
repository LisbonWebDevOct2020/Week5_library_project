require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const helpers      = require('handlebars-helpers');
const session      = require('express-session');
const MongoStore   = require('connect-mongo')(session);

//Register helpers list from handlebars-helpers
hbs.registerHelper(helpers());

mongoose
  .connect('mongodb://localhost/library-project', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
// Express session setup
app.use(
  session({
    secret: 'my secret',
    cookie: { maxAge: 60000},
    rolling: true,
    store: new MongoStore({ //store session information in mongo
      mongooseConnection: mongoose.connection
    })
  })
)

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


// default value for title local
app.locals.title = 'Book store';
//app.locals.subtitle = '';
//app.locals.genericErrorMessage = '';

const index = require('./routes/index');
app.use('/', index);

const book = require('./routes/book');
app.use('/', book);

const author = require('./routes/author');
app.use('/', author);

const auth = require('./routes/auth');
app.use('/', auth);

module.exports = app;