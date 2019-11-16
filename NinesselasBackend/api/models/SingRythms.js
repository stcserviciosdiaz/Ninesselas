/**
 * SingRythms.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombreCanto:{
      type: 'string',
      required: false,
      description: 'nombre del ritmo del canto',
      example: 'Hip-Hop',
    },

    nivelCanto:{
      type: 'string',
      required: false,
      description: 'nivel de practica del ritmo',
      example: 'no profesional',
    },

    userSingFK:{
      model: 'User',
    },
  },

};

