/**
 * Tattoos.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    ubicacionFoto:{
      type: 'string',
      required: false,
      description: 'ubicacion del contenedor de la foto',
      example: 'PATH',
    },

    userTattoosFK:{
      model: 'User',
    },

  },

};

