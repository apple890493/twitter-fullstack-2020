const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const Public = db.Public;
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
  },
  postPrivateMessages: (req, res) => {
    let sender = helpers.getUser(req);
    let receiever = req.params.id;
  },
  postMessage: (req, res) => {
    let message = req.body.message;
    let user = helpers.getUser(req).name;
    //console.log(helpers.getUser(req).name);
    let io = req.app.get('socketio');

    io.emit('public', { user, message });

    Public.create({ UserId: helpers.getUser(req).id, message }).then(() => {
      return res.redirect('/chatroom');
    });
  },
};

module.exports = chatController;
