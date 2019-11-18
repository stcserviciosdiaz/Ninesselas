/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
//const User = require('../models/user')
const jwt = require('jsonwebtoken')
module.exports = {

  hello: async function (req, res) {
    return res.send('Hi there!');
  },

  signup: async (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var rol = req.body.rol;
    var email = req.body.email;

    var newuser = {
      username: username,
      password: password,
      rol:rol,
      email:email
    }
    User.create(newuser).exec(function (err, users) {
      if (err) {
        res.status(500).send({error: err + 'Database Error'});
      }
      res.json(users);
    });


    // let created = await User.create(
    //   {
    //     email: params.email,
    //     username: params.username,
    //     password: params.password,
    //     rol: params.rol
    //   }).fetch();
    //
    // //console.log('resultado de la creacion: ',created);
    // let payload = {
    //   subject: created.id
    // }
    // //console.log('el payload tiene: ',payload);
    // let token = jwt.sign(payload, 'llaveSecreta');
    // //console.log('el TOKEN ES: ',token);
    // res.status(200).send({token});

  //   var name = req.body.nombre;
  //   var user = {
  //     nombre: name
  //   }
  //
  //   User.create(user).exec(function (err, recipes) {
  //     if (err) {
  //       res.status(500).send({error: err + 'Database Error'});
  //     }
  //     res.json(recipes);
  //   });
  // },

  },

  login:(req,res)=>{
    let userData=req.body
    Usuario.findOne({email:userData.email},(error,user)=>{
      if(error){
        console.log(error)
      }else {
        if(!user){
          res.status(401).send('Invalid email')
        } else
        if(user.password !== userData.password) {
          res.status(401).send('Invalid password')
        }else
        {
          //console.log('el usuario consultado es: ',user);
          let payload = {
            subject: user.id
          }
          //console.log('el payload (login) es:', payload);
          let token = jwt.sign(payload,'llaveSecreta');
          //console.log('el token (login) es: ', token);
          res.status(200).send({token});
        }
      }
    })
  },


  getUsuario: async (req, res)=>{
    if(!req.headers.authorization){
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
      return res.status(406).send('El token esta vacio');
    }
    console.log('token :',token);
    let payload = jwt.verify(token, 'llaveSecreta');
    if(!payload){
      return res.status(401).send('El token es incorrecto');
    }
    //console.log('el payload es: ',payload);
    let idUsuario = payload.subject;
    //console.log('ahora el id del usuario es: ',idUsuario);
    Usuario.findOne({id:idUsuario},(error, usuarioEncontrado) =>{
      if(error){
        res.status(401).send('no existe el usuario');
      }else{
        res.status(200).send({usuarioEncontrado});
      }
    })
  },

  updateUsuario: async (req, res) => {
    if(!req.headers.authorization){
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
      return res.status(406).send('El token esta vacio');
    }
    console.log('token :',token);
    let payload = jwt.verify(token, 'llaveSecreta');
    if(!payload){
      return res.status(401).send('El token es incorrecto');
    }
    console.log('el payload es: ',payload);
    let idUsuario = payload.subject;
    console.log('ahora el id del usuario es: ',idUsuario);
    let Data = req.allParams();
    console.log('el contenido de la consulta es: ',Data);
    let updated = await Usuario
      .update(
        {id:idUsuario},
        {
          nombreUsuario: Data.nombreUsuario,
          apellidoUsuario: Data.apellidoUsuario,
          fechaNacimientoUsuario: Data.fechaNacimientoUsuario
        })
      .fetch();
    res.status(200).send({updated});
  },

  deleteUser: async(req, res)=>{
    let params = req.allParams();
    let deleted = await Usuario.destroy({_id:params.id}).fetch();
    return res.status(200).json(deleted);
  },

  verifyToken: (req, res, next)=>{
    if(!req.headers.authorization){
      return res.status(401).send('Unauthorized Request');
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null'){
      return res.status(401).send('Unauthorized Request');
    }
    let payload = jwt.verify(token, 'llaveSecreta');
    if(!payload){
      return res.status(401).send('Unauthorized Request');
    }
    req.userId = payload.subject
    next()

  }

};
