/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
// var bcrypt = require("bcryptjs");
module.exports = {

  attributes: {


      rol: {
        type: 'string',
        required: true,
        description: 'Define si busca trabajo, busca contratar o es el administrador',
        example: 'Administrador',
      },
      username: {
        type: 'string',
        required: true,
        description: 'Representación completa del nombre del usuario',
        example: 'Daniebro',
      },

    password: {
      type: 'string',
      required: true,
      description: 'Se guarda el hash de la password',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad',
    },

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      example: 'nombre.apellido@ejemplo.com',
    },

    imagenUsuario: {
        type: 'string',
      required: false,
      description: 'locacion de la imagen de perfil',
      example: 'PATH',
    },
      nombreArtistico: {
        type: 'string',
        required: false,
        description: 'Nombre por el cual lo conocen popularmente',
        example: 'Danni el más pro',
      },
      primerNombre: {
        type: 'string',
        required: false,
        description: 'Primer nombre del usuario',
        example: 'Danni',
      },
      apellidos: {
        type: 'string',
        required: false,
        description: 'apellidos del usuario',
        example: 'Brito Morales',
      },
      genero: {
        type: 'boolean',
        required: false,
        description: 'genero del usuario',
        example: 'Masculino',
      },

      alias: {
        type: 'string',
        required: false,
        description: 'Otro nombre del usuario',
        example: 'Daniebro1',
      },
      telefonoFijo: {
        type: 'string',
        required: false,
        description: 'numero de telefono fijo',
        example: '+593998334100',
      },
      fechaNacimiento: {
        type: 'string',
        required: false,
        description: 'Representación completa del nombre del usuario',
        example: 'Daniebro',
      },
      pais: {
        type: 'string',
        required: false,
        description: 'Pais de origen del usuario',
        example: 'Daniebro',
      },
      tallaPantalon: {
        type: 'number',
        required: false,
        description: 'talla de pantalon que usa el usuario',
        example: '32',
      },
      tallaCamisa: {
        type: 'number',
        required: false,
        description: 'talla de camisa que usa el usuario',
        example: 'Medium',
      },
      tallaChaqueta: {
        type: 'number',
        required: false,
        description: 'talla de chaqueta que usa el usuario',
        example: 'Large',
      },
      pie: {
        type: 'number',
        required: false,
        description: 'talla de zapatos que usa el usuario',
        example: '40',
      },
      altura: {
        type: 'number',
        required: false,
        description: 'altura en centimetros del usuario',
        example: '172',
      },
      colorPiel: {
        type: 'string',
        required: false,
        description: 'color de la piel del usuario',
        example: 'Blanco',
      },
      colorPelo: {
        type: 'string',
        required: false,
        description: 'color de la cabellera del usuario',
        example: 'Rojo',
      },
      colorOjos: {
        type: 'string',
        required: false,
        description: 'color de los ojos del usuario',
        example: 'verdes',
      },
      numeroDNI: {
        type: 'string',
        required: false,
        description: 'numero de identificacion del usuario',
        example: '17839127391',
      },
      numeroSeguridadSocial: {
        type: 'string',
        required: false,
        description: 'numero de seguro social del usuario',
        example: '8374987391',
      },
      modeloCoche: {
        type: 'string',
        required: false,
        description: 'modelo del coche del usuario',
        example: 'Nissan Sentra',
      },
      modeloMoto: {
        type: 'string',
        required: false,
        description: 'nmodelo de moto del usuario',
        example: 'Hyundai N57',
      },



      razaMascota: {
        type: 'string',
        required: false,
        description: 'raza de la mascota del usuario',
        example: 'Pastor Aleman',
      },
      numeroDNIPadre: {
        type: 'string',
        required: false,
        description: 'numero de identificacion del padre del usuario',
        example: '8374987391',
      },
      numeroDNIMadre: {
        type: 'string',
        required: false,
        description: 'numero de identificacion de la madre del usuario',
        example: '8374987391',
      },
      ultimosTrabajos: {
        type: 'string',
        required: false,
        description: 'descripcion de los ultimos lugares de trabajo',
        example: 'Trabaje en ..... por ...',
      },

      bookPhotos: {
        type: 'string',
        required: false,
        description: 'archivo del book de photos',
        example: 'PATH',
      },

      curriculum: {
        type: 'string',
        required: false,
        description: 'archivo del curriculum',
        example: 'PATH',
      },
      fotoMano: {
        type: 'string',
        required: false,
        description: 'archivo de la fotografía de las manos',
        example: 'PATH',
      },

      idiomasHablados:{
        collection: 'Language',
        via: 'userLanguageFK',
      },
      deportes:{
        collection: 'Sport',
        via: 'userSportFK',
      },
      tattoos:{
        collection: 'Tattoos',
        via: 'userTattoosFK',
      },

      tipoUsuario:{
        collection: 'UserType',
        via: 'userTypeFK',
      },

      bailes:{
        collection: 'DanceRythms',
        via: 'userDanceFK',
      },

      cantos:{
        collection: 'SingRythms',
        via: 'userSingFK',
      },

      habilidades:{
        collection: 'Skills',
        via: 'userSkillsFK',
      },

      instrumentos: {
        collection: 'MusicalInstruments',
        via: 'userInstrumentFK',
      },

    // toJSON: function () {
    //   var obj = this.toObject();
    //   delete obj.password; //remove the password field when displaying the user model object
    //   return obj;
    // }

    },
  /**
   * this holds our validation message by
   * sails-hook-validation dependency
   */
  // validationMessages: { //hand for i18n & l10n
  //   names: {
  //     required: 'Name is required'
  //   },
  //   email: {
  //     email: 'Provide valid email address',
  //     required: 'Email is required',
  //     unique: 'This email is already existing'
  //   },
  //   password: {
  //     required: 'Password is required'
  //   }
  // },

  /**
   * this is called so we can create our password hash for us
   *
   * before saving
   * @param values
   * @param cb
   */
  // beforeCreate: function (values, cb) {
  //
  //   // Hash password
  //   bcrypt.hash(values.password, 10, function (err, hash) {
  //     if (err) return cb(err);
  //     values.password = hash;
  //     cb();
  //   });
  // }



};

