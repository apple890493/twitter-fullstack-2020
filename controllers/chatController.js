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
    let userSelf = Number(helpers.getUser(req).id);
    Public.findAll({ include: [User] }).then((messages) => {
      if (messages) {
        let msg = messages.map((m) => m.dataValues);
        msg.forEach((m) => {
          m.isSelf = Number(m.UserId) === userSelf;
        });
        console.log('@@@', msg);
        return res.render('chatroom/publicChat', {
          messages: msg,
        });
      } else {
        return res.render('chatroom/publicChat');
      }
    });
  },
  getPrivateMessagePage: (req, res) => {
    let userSelf = Number(helpers.getUser(req).id);

    Private.findAll({
      where: { [Op.or]: { SendId: userSelf, ReceiveId: userSelf } },
      order: [['createdAt', 'DESC']],
    }).then((data) => {
      // console.log(data);
      if (data.length > 0) {
        let latestId =
          Number(data[0].SendId) === userSelf
            ? data[0].ReceiveId
            : data[0].SendId;
        res.redirect(`/message/${latestId}`);
      } else {
        res.render('chatroom/privateChat', { empty: '尚未有訊息!', isEmpty: true });
      }
    });

    //return res.render('chatroom/privateChat');
  },
  getPrivateMessageToUser: async (req, res) => {
    let sender = helpers.getUser(req);

    let senderId = Number(sender.id);
    let receiever = Number(req.params.id);

    let history, messages;

    await Private.findAll({
      where: {
        SendId: { [Op.or]: [senderId, receiever] },
        ReceiveId: { [Op.or]: [senderId, receiever] },
      },
      include: [
        { model: User, as: 'Sender' },
        { model: User, as: 'Receiver' },
      ],
    }).then((msg) => {
      if (msg.length > 0) {
        return (history = msg.map((m) => ({
          ...m.dataValues,
          isSelf: m.dataValues.SendId === senderId,
        })));
      } else {
        return (history = []);
      }
    });

    await Private.findAll({
      where: { [Op.or]: [{ SendId: senderId }, { ReceiveId: senderId }] },
      include: [
        { model: User, as: 'Sender' },
        { model: User, as: 'Receiver' },
      ],
      order: [['createdAt', 'desc']],
    }).then((allMessages) => {
      if (allMessages.length < 0) {
        return (messages = []);
      }
      let temp = [];

      let allmessages = allMessages.map((m) => ({
        ...m.dataValues,
        isSelf: m.dataValues.SendId === senderId,
      }));
      //console.log('@@@@@', allmessages);
      allmessages.forEach((am) => {
        if (temp.length > 0) {
          let index = temp.findIndex(
            (t) =>
              (t.SendId === am.SendId && t.ReceiveId === am.ReceiveId) ||
              (t.SendId === am.ReceiveId && t.ReceiveId === am.SendId),
          );

          if (index === -1) {
            temp.push(am);
          } else {
            let other = temp[index];
            if (other.createdAt < am.createdAt) {
              temp.splice(index, 1);
              temp.push(am);
            }
          }
        } else {
          temp.push(am);
        }
      });

      messages = temp.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    });

    //console.log('@@@ history', history);
    //console.log('@@@ messages', messages);

    return User.findByPk(receiever).then((user) => {
      if (!user) {
        return res.redirect('back');
      }
      let visitUser = user.toJSON();
      return res.render('chatroom/privateChat', {
        visitUser,
        history,
        messages,
      });
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
    let self = helpers.getUser(req).id;
    console.log(helpers.getUser(req).id);
    let io = req.app.get('socketio');

    io.emit('public', { user, message, self });

    Public.create({ UserId: helpers.getUser(req).id, message }).then(() => {
      //return res.redirect('/chatroom');
      return res.redirect('javascript:history.back()');
    });
  },
};

module.exports = chatController;
