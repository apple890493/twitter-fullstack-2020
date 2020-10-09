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
};

module.exports = chatController;
