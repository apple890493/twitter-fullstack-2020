const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const { Op } = require('sequelize');
const helpers = require('../_helpers');

const chatController = {
  getChatRoom: (req, res) => res.render('chatroom/publicChat'),
  getMessage: (req, res) => {
    return res.render('chatroom/publicChat');
  },
  postMessage: (req, res) => {
    let message = req.body.message;
    let user = helpers.getUser(req).name;
    //console.log(helpers.getUser(req).name);
    let io = req.app.get('socketio');

    io.emit('public', { user, message });
  },
};

module.exports = chatController;
