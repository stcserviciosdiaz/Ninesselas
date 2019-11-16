/**
 * Language.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombreIdioma:{
      type: 'string',
      required: false,
      description: 'nombre del idioma q habla',
      example: 'ingles',
    },

    nivelIdioma:{
      type: 'string',
      required: false,
      description: 'nivel de practica del idioma',
      example: 'nativo',
    },

    userLanguageFK:{
      model: 'User',
    },

  },

};

