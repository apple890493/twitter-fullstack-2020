const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Public = db.Public;
const Private = db.Private;
const { Op } = require('sequelize');
const helpers = require('../_helpers');

const onlineUserCount = 0;
const onlineUsers = [];

const chatController = {
  getChatRoom: (req, res) => {
    Public.findAll({ include: [User] }).then((messages) => {
      if (messages) {
        let msg = messages.map((m) => m.dataValues);
        return res.render('chatroom/publicChat', {
          messages: msg,
        });
      } else {
        return res.render('chatroom/publicChat');
      }
    });
  },
  getPrivateMessagePage: (req, res) => {
    let userSelf = helpers.getUser(req);

    let io = req.app.get('socketio');

    return res.render('chatroom/privateChat');
  },
  getPrivateMessageToUser: (req, res) => {
    let sender = helpers.getUser(req);
    let receiever = req.params.id;

    User.findByPk(receiever).then((user) => {
      let visitUser = user.toJSON();
      return res.render('chatroom/privateChat', { visitUser });
    });
  },
  postPrivateMessages: (req, res) => {
    let sender = helpers.getUser(req).id;
    let receiever = Number(req.params.id);

    let io = req.app.get('socketio');
    const roomId = `${sender}_${receiever}`;

    let message = req.body.message;

    let messageExisted = message && message.length !== 0;

    io.on('connection', (socket) => {
      socket.join(roomId);
      console.log('join room!');
      // if(messageExisted){
      //   io.to()
      // }
    });

    if (messageExisted) {
      io.to(roomId).emit('send_private_message', {
        roomId,
        sender,
        receiever,
        message,
      });

      Private.create({
        SendId: sender,
        ReceiveId: receiever,
        message,
      }).then(() => {
        res.redirect(`/message/${receiever}`);
      });
    } else {
      req.flash('errorMessage', '訊息不可為空白');
      res.redirect(`/message/${receiever}`);
    }
  },
  getPrivateRoom: (req, res) => res.render('chatroom/privateChat'),
  getMessage: (req, res) => {
    return res.render('chatroom/publicChat');
  },
  postMessage: (req, res) => {
    let message = req.body.message;
    let user = helpers.getUser(req).name;
    //console.log(helpers.getUser(req).name);
    let io = req.app.get('socketio');

    io.emit('public', { user, message });

    Public.create({ UserId: helpers.getUser(req).id, message }).then(() => {
      //return res.redirect('/chatroom');
      res.redirect('javascript:history.back()');
    });
  },
};

module.exports = chatController;
