/**
 * MusicalInstruments.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombreInstrumento:{
      type: 'string',
      required: false,
      description: 'nombre del instrumento musical',
      example: 'guitarra',
    },

    nivelInstrumentos:{
      type: 'string',
      required: false,
      description: 'nivel de practica del idioma',
      example: 'experto',
    },

    userInstrumentFK:{
      model: 'User',
    },

  },

};

