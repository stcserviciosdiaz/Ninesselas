/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
//const User = require('../models/user')
const jwt = require('jsonwebtoken')
var bcrypt = require("bcryptjs");

module.exports = {

  hello: async function (req, res) {
    return res.send('Hi there!');
  },

  signup: async function (req, res) {
    var newuser = req.body;
    await User.create(newuser);
    let userId;
    let userData = { email: newuser.email };
    await User.findOne(userData, (error, user) => {
      if (error) {
        console.log(error)
      } else {
        req.session.userId = user.id;
        userId = user.id;
        let payload = {subject: userId};
        let token = jwt.sign(payload, 'secretKey');
        res.status(200).send({token});
      }
    });

  },

  login: async function (req, res) {
    let userData = req.body;
    await User.findOne({email: userData.email}, (error, user) => {
      if (error) {
        console.log(error)
      } else {
        if (!user) {
          res.status(401).send('Invalid email')
        } else {
          if (!bcrypt.compareSync(userData.password, user.password)) {
            res.status(401).send('invalid password')
          } else {
            let payload = { subject: user.id };
            let token = jwt.sign(payload, 'secretKey');
            res.status(200).send({ token: token, rol: user.rol });
            req.session.userId = user.id;
          }
        }
      }
    })

  },

  getUsuario: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
      return res.status(406).send('El token esta vacio' + req.headers.authorization);
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
      return res.status(401).send('El token es incorrecto');
    }

    let userId = payload.subject;
    console.log(userId)
    User.findOne({ id: userId }, (error, usuarioEncontrado) => {
      if (error) {
        res.status(401).send('No existe el usuario');
      } else {
        res.status(200).send(usuarioEncontrado);
      }
    });
  },

  getAllUsers: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
      return res.status(406).send('El token esta vacio' + req.headers.authorization);
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
      return res.status(401).send('El token es incorrecto');
    }

    await User.find({ rol: 'CommonUser' }, (error, usuariosEncontrados) => {
      if (error) {
        res.status(401).send('no se encontraron usuarios');
      } else {
        res.status(200).send(usuariosEncontrados);
      }
    });
  },

  getAllCompanies: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
      return res.status(406).send('El token esta vacio' + req.headers.authorization);
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
      return res.status(401).send('El token es incorrecto');
    }
    await User.find({rol: 'Company'}, (error, usuariosEncontrados) => {
      if (error) {
        res.status(401).send('no se encontraron usuarios');
      } else {
        res.status(200).send(usuariosEncontrados);
      }
    });
  },

  updateUsuario: async function (req, res) {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
      return res.status(406).send('El token esta vacio');
    }
    let payload = jwt.verify(token, 'llaveSecreta');
    if (!payload) {
      return res.status(401).send('El token es incorrecto');
    }
    let userId = payload.subject;
    let userData = req.body;
    await User.update({ id: userId }).set(userData)

  },

  deleteUser: async function (req, res) {
    let params = req.body;
    await User.destroyOne({id: params.id});
    return res.status(200).send('Usuario Eliminado');
  },

  /**
   * Upload avatar for currently logged-in user
   *
   * (POST /user/avatar)
   */
  uploadAvatar: function (req, res) {

    let userId;

    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
      return res.status(406).send('El token esta vacio' + req.headers.authorization);
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
      return res.status(401).send('El token es incorrecto');
    }
    let emailUser = payload.subject;
    User.findOne({email: emailUser}, (error, usuarioEncontrado) => {
      if (error) {
        res.status(401).send('No existe el usuario');
      } else {
        res.status(200).send(usuarioEncontrado);
        userId = usuarioEncontrado.id
      }
    })


    req.file('avatar').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000,
      //dirname: require('path').resolve(sails.config.appPath, 'assets/avatars/')
    }, async function whenDone(err, uploadedFiles) {
      if (err) {
        return res.serverError(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded');
      }

      // Get the base URL for our deployed application from our custom config
      // (e.g. this might be "http://foobar.example.com:1339" or "https://example.com")
      //var baseUrl = sails.config.custom.baseUrl;

      await User.update({id: userId})
        .set({
          // Generate a unique URL where the avatar can be downloaded.
          avatarUrl: require('util').format('%s/%s', require('path').resolve(sails.config.appPath, 'assets/avatars'), userId),
          //   // Grab the first file and use it's `fd` (file descriptor)
          avatarFd: uploadedFiles[0].fd
        })
    });
  },


  /**
   * Download avatar of the user with the specified id
   *
   * (GET /user/avatar/:id)
   */

  avatar: function (req, res) {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if (token === 'null') {
      return res.status(406).send('El token esta vacio' + req.headers.authorization);
    }
    let payload = jwt.verify(token, 'secretKey');
    if (!payload) {
      return res.status(401).send('El token es incorrecto');
    }
    let emailUser = payload.subject;
    User.findOne({email: emailUser}, (error, usuarioEncontrado) => {
      if (error) {
        res.status(401).send('No existe el usuario');
      } else {
        fs.createReadStream(Path.resolve(req.param('path')))
          .on('error', function (err) {
            return res.serverError(err);
          })
          .pipe(res);
      }
    });
  }

};
