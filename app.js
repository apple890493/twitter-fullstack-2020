const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./_helpers');
const session = require('express-session');
const passport = require('./config/passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const middleware = require('./config/middleware');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = express();
const port = process.env.PORT || 3000;

app.engine(
  'hbs',
  exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./config/handlebars-helper'),
  }),
);
app.set('view engine', 'hbs');

app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({ secret: 'test', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(middleware.topUsers);

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  res.locals.isAuthenticated = helpers.ensureAuthenticated(req);
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  res.locals.userInput = req.flash('userInput')[0];
  res.locals.successFlashMessage = req.flash('successFlashMessage');
  res.locals.errorFlashMessage = req.flash('errorFlashMessage');
  res.locals.successScrollingMessage = req.flash('successScrollingMessage');
  res.locals.errorScrollingMessage = req.flash('errorScrollingMessage');

  next();
});
let userSelf;

app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    userSelf = helpers.getUser(req);
  }
  next();
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

const io = require('socket.io')(server);
app.set('socketio', io);


// 監聽connection這個event
// io.on('connection', (socket) => {
//   // 監聽chat message 這個event
//   socket.on('chat message', (msg) => {
//     //console.log('message: ' + msg);
//     io.emit('chat message', { msg, userSelf });
//   });
//   // console.log('a user connected');
//   // socket.on('disconnect', () => {
//   //   console.log('user disconnect.');
//   // });
// });

// This will emit the event to all connected sockets
// io.emit('some event', {
//   someProperty: 'some value',
//   otherProperty: 'other value',
// });

// io.on('connection', (socket) => {
//   socket.broadcast.emit('hi');
// });

/*
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});
*/
require('./routes/index')(app);
module.exports = app;
