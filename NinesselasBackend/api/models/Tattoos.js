/**
 * Tattoos.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    tattooFoto:     { type: 'string', required: false },
    tattooFotoFd:   { type: 'string', required: false },

    userTattoosFK:{
      model: 'User',
    },

  },

};

