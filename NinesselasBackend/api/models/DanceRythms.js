/**
 * DanceRythms.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombreBaile:{
      type: 'string',
      required: false,
      description: 'nombre del ritmo del baile',
      example: 'Pastor Aleman',
    },

    nivelBaile:{
      type: 'string',
      required: false,
      description: 'nivel de practica del ritmo',
      example: 'profesional',
    },

    userDanceFK:{
      model: 'User',
    },

  },

};

