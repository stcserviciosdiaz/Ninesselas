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

  signup: async function (req, res) {
    var rol = req.param('rol','Common User');
    var username = req.param('username');
    var email = req.param('email')
    var password = req.param('password');
    var nombreArtistico = req.param('nombreArtistico','');
    var primerNombre = req.param('');
    var apellidos = req.param('apellidos','');
    var genero = req.param('genero',0);
    var alias = req.param('alias','');
    var telefonoFijo = req.param('telefonoFijo','');
    var fechaNacimiento = req.param('fechaNacimiento','');
    var pais = req.param('pais','');
    var tallaPantalon = req.param('tallaPantalon',0);
    var tallaCamisa = req.param('tallaCamisa',0);
    var tallaChaqueta = req.param('tallaChaqueta',0);
    var pie = req.param('pie',0);
    var altura = req.param('altura',0);
    var colorPiel = req.param('colorPiel','');
    var colorPelo = req.param('colorPelo','');
    var colorOjos = req.param('colorOjos','');
    var numeroDNI = req.param('numeroDNI','');
    var numeroSeguridadSocial = req.param('numeroSeguridadSocial','');
    var modeloCoche = req.param('modeloCoche','');
    var modeloMoto = req.param('modeloMoto','');
    var razaMascota = req.param('razaMascota','');
    var numeroDNIPadre = req.param('numeroDNIPadre','');
    var numeroDNIMadre = req.param('numeroDNIMadre','');
    var ultimosTrabajos = req.param('ultimosTrabajos','');

    var newuser = {
      username: username,
      password: password,
      rol:rol,
      email:email,
      nombreArtistico: nombreArtistico,
      primerNombre: primerNombre,
      apellidos: apellidos,
      genero: genero,
      alias: alias,
      telefonoFijo: telefonoFijo,
      fechaNacimiento: fechaNacimiento,
      pais: pais,
      tallaPantalon: tallaPantalon,
      tallaCamisa: tallaCamisa,
      tallaChaqueta: tallaChaqueta,
      pie: pie,
      altura: altura,
      colorPiel: colorPiel,
      colorPelo: colorPelo,
      colorOjos: colorOjos,
      numeroDNI: numeroDNI,
      numeroSeguridadSocial: numeroSeguridadSocial,
      modeloCoche: modeloCoche,
      modeloMoto: modeloMoto,
      razaMascota: razaMascota,
      numeroDNIPadre: numeroDNIPadre,
      numeroDNIMadre: numeroDNIMadre,
      ultimosTrabajos: ultimosTrabajos,
    }
    await User.create(newuser);

    let payload = { subject: newuser.email }
    let token = jwt.sign(payload, 'secretKey')
    res.status(200).send({token});
  },

  login: async function (req,res) {
    let userData = {
      email: req.param('email'),
      password: req.param('password')
    }
    await User.findOne(userData, (error, user) => {
      if (error){
        console.log(error)
      } else {
        if (!user) {
          res.status(401).send('Invalid email')
        } else {
          if (user.password !== userData.password){
            res.status(401).send('invalid password')
          } else {
            let payload = { subject: user.email}
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token: token, rol: user.rol})
          }
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

//   let firstName = req.param('first_name'),
//   lastName = req.param('last_name'),
//   age = req.param('age');
//
// if(!firstName){
//   return res.badRequest({err:'Invalid first_name'});
// }
//
// if(!lastName){
//   return res.badRequest({err:'Invlaid last_name'});
// }
//
// User.create({
//   first_name : firstName,
//   last_name : lastName,
//   age:age
// })
//   .then(_user => {
//     if(!_user) return res.serverError({err:'Unable to create user'});
//
//     return res.ok(_user); //to learn more about responses check api/responses folder
//   })
//   .catch(err => res.serverError(err.message));
// }

};
