const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('./_helpers');
const session = require('express-session');
const passport = require('./config/passport');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const middleware = require('./config/middleware');

//const socket = require('socket.io');

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

let id, name, account, avatar;

app.use((req, res, next) => {
  if (helpers.getUser(req)) {
    ({ id, name, account, avatar } = helpers.getUser(req));
  }
  next();
});

let onlineUsers = [];

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);
const io = require('socket.io')(server);
app.set('socketio', io);

/** chat room **/
io.on('connection', (socket) => {
  // 把上線使用者的資料放入陣列儲存 並去重複
  onlineUsers.push({ id, name, account, avatar });
  let set = new Set();
  onlineUsers = onlineUsers.filter((item) =>
    !set.has(item.id) ? set.add(item.id) : false,
  );
  const user = onlineUsers.find((user) => user.id === id);
  user.current = true;

  socket.emit('message', `Hello, ${user.name}`);
  socket.broadcast.emit('message', `${user.name} join chatroom`);
  io.emit('onlineUsers', onlineUsers);

  socket.on('disconnect', () => {
    onlineUsers = onlineUsers.filter((user) => user.id !== id);
    io.emit('onlineUsers', onlineUsers);
    socket.broadcast.emit('message', `${user.name} left chatroom`);
  });
});

require('./routes/index')(app);
module.exports = app;

// socket.on('greet', (name) => {
//       let notice = `${name: username
//     } is online`;
//     console.log(notice);
//       noticelist.innerHTML += `< div class= "notice" > ${ notice }</div > `
//     })
