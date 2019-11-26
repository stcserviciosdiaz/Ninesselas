/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require("bcryptjs");
module.exports = {

  attributes: {

    email:                    { type: 'string', required: true, unique: true, isEmail: true, maxLength: 200 },
    password:                 { type: 'string', required: true, protect: true },
    rol:                      { type: 'string', required: true },
    username:                 { type: 'string', required: false },
    nombres:                  { type: 'string', required: false },
    apellidos:                { type: 'string', required: false },
    numeroDNI:                { type: 'string', required: false },
    numeroSeguridadSocial:    { type: 'string', required: false },
    telefonoFijo:             { type: 'string', required: false },
    telefonoMovil:            { type: 'string', required: false },
    fechaNacimiento:          { type: 'string', required: false },
    lugarNacimiento:          { type: 'string', required: false },
    direccion:                { type: 'string', required: false },
    pais:                     { type: 'string', required: false },
    localidad:                { type: 'string', required: false },
    tallaPantalon:            { type: 'string', required: false },
    tallaCamisa:              { type: 'string', required: false },
    tallaChaqueta:            { type: 'string', required: false },
    pie:                      { type: 'string', required: false },
    altura:                   { type: 'string', required: false },
    colorPiel:                { type: 'string', required: false },
    colorPelo:                { type: 'string', required: false },
    colorOjos:                { type: 'string', required: false },
    modeloCoche:              { type: 'string', required: false },
    colorCoche:               { type: 'string', required: false },
    colorMoto:                { type: 'string', required: false },
    descripcionMascotas:      { type: 'string', required: false },
    nombreArtistico:          { type: 'string', required: false },
    iban:                     { type: 'string', required: false },
    mayorEdad:                { type: 'string', required: false },
    avatarUrl:                { type: 'string', required: false },
    avatarFd:                 { type: 'string', required: false },
    genero:                   { type: 'string', required: false },
    numeroDNIRepresentante:   { type: 'string', required: false },
    ultimosTrabajos:          { type: 'string', required: false },
    bookPhotosUrl:            { type: 'string', required: false },
    bookPhotosFd:             { type: 'string', required: false },
    curriculum:               { type: 'string', required: false },

    idiomasHablados: {
      collection: 'Language',
      via: 'userLanguageFK',
    },

    deportes: {
      collection: 'Sport',
      via: 'userSportFK',
    },

    tattoos: {
      collection: 'Tattoos',
      via: 'userTattoosFK',
    },

    tipoUsuario: {
      collection: 'UserType',
      via: 'userTypeFK',
    },

    bailes: {
      collection: 'DanceRythms',
      via: 'userDanceFK',
    },

    cantos: {
      collection: 'SingRythms',
      via: 'userSingFK',
    },

    habilidades: {
      collection: 'Skills',
      via: 'userSkillsFK',
    },

    instrumentos: {
      collection: 'MusicalInstruments',
      via: 'userInstrumentFK',
    },

  },

  /**
   * this is called so we can create our password hash for us
   *
   * before saving
   * @param values
   * @param cb
   */
  beforeCreate: function (values, cb) {

    // Hash password
    bcrypt.hash(values.password, 10, function (err, hash) {
      if (err) return cb(err);
      values.password = hash;
      cb();
    });
  }


};

