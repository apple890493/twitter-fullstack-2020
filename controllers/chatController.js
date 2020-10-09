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
    let username = helpers.getUser(req).name;
    let io = req.app.get('socketio');

    let { id, name, account, avatar } = helpers.getUser(req);

    io.emit('direct', { id, name, account, avatar });

    Public.findAll({ include: [User] }).then((messages) => {
      if (messages) {
        let msg = messages.map((m) => m.dataValues);
        return res.render('chatroom/publicChat', {
          messages: msg,
        });
      }
    });
  },
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
      return res.redirect('/chatroom');
    });
  },
};

module.exports = chatController;
