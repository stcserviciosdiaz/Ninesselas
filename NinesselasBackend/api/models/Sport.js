/**
 * Sport.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombreDeporte:{
      type: 'string',
      required: false,
      description: 'nombre del idioma q habla',
      example: 'Basketball',
    },

    nivelDeporte:{
      type: 'string',
      required: false,
      description: 'nivel de practica del deporte',
      example: 'profesional',
    },

    userSportFK:{
      model: 'User',
    },

  },

};

