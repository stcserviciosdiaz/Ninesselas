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
    rol:                      { type: 'string', required: true  },
    username:                 { type: 'string', required: false },
    nombres:                  { type: 'string', required: false },
    apellidos:                { type: 'string', required: false },
    nombreArtistico:          { type: 'string', required: false },
    sexo:                     { type: 'string', required: false },
    telefono:                 { type: 'string', required: false },
    fechaNacimiento:          { type: 'string', required: false },
    nacionalidad:             { type: 'string', required: false },
    acento:                   { type: 'string', required: false },
    tallaPantalon:            { type: 'string', required: false },
    tallaCamisa:              { type: 'string', required: false },
    tallaChaqueta:            { type: 'string', required: false },
    pie:                      { type: 'string', required: false },
    altura:                   { type: 'string', required: false },
    colorPiel:                { type: 'string', required: false },
    colorPelo:                { type: 'string', required: false },
    colorOjos:                { type: 'string', required: false },
    numeroDNI:                { type: 'string', required: false },
    numeroSeguridadSocial:    { type: 'string', required: false },
    copySocialNumber:         { type: 'string', required: false },
    numeroDNIPadre:           { type: 'string', required: false },
    numeroDNIMadre:           { type: 'string', required: false },
    copyDNIFather:            { type: 'string', required: false },
    CopyDNIMother:            { type: 'string', required: false },
    copyDNIkid:               { type: 'string', required: false },
    libroFamilia:             { type: 'string', required: false },
    libroFamiliaFd:           { type: 'string', required: false },
    carnetConducir:           { type: 'string', required: false },
    modeloCoche:              { type: 'string', required: false },
    colorCoche:               { type: 'string', required: false },
    fotoCoche:                { type: 'string', required: false },
    fotoCocheFd:              { type: 'string', required: false },
    modeloMoto:               { type: 'string', required: false },
    colorMoto:                { type: 'string', required: false },
    fotoMoto:                 { type: 'string', required: false },
    fotoMotoFd:               { type: 'string', required: false },
    videoBook:                { type: 'string', required: false },
    videoBookFd:              { type: 'string', required: false },
    curriculum:               { type: 'string', required: false },
    curriculumFd:             { type: 'string', required: false },
    avatar:                   { type: 'string', required: false },
    avatarFd:                 { type: 'string', required: false },
    ultimosTrabajos:          { type: 'string', required: false },
    observaciones:            { type: 'string', required: false },
    direccion:                { type: 'string', required: false },
    localidad:                { type: 'string', required: false },
    iban:                     { type: 'string', required: false },
    etnico:                   { type: 'string', required: false },
    deporte:                  { type: 'string', required: false },
    actor:                    { type: 'string', required: false },
    musicos:                  { type: 'string', required: false },
    estilocantos:             { type: 'string', required: false },
    estilobailes:             { type: 'string', required: false },
    habdeportes:              { type: 'string', required: false },
    placebirth:               { type: 'string', required: false },
    codpostal:                { type: 'string', required: false },

    tattoos: {
      collection: 'Tattoos',
      via: 'userTattoosFK',
    },

    manos: {
      collection: 'Hands',
      via: 'userHandsFK',
    },

    mascotas: {
      collection: 'Pets',
      via: 'userPetsFK',
    },

    deportes: {
      collection: 'Sport',
      via: 'userSportFK',
    },

    bailes: {
      collection: 'DanceRythms',
      via: 'userDanceFK',
    },

    instrumentos: {
      collection: 'MusicalInstruments',
      via: 'userInstrumentFK',
    },

    cantos: {
      collection: 'SingRythms',
      via: 'userSingFK',
    },
    habilidades: {
      collection: 'Skills',
      via: 'userSkillFK',
    },

    idiomasHablados: {
      collection: 'Language',
      via: 'userLanguageFK',
    },
    tipoUsuario: {
      collection: 'UserType',
      via: 'userTypeFK',
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

