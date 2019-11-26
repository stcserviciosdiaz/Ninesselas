/**
 * Skills.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    nombreHabilidad:{
      type: 'string',
      required: false,
      description: 'nombre de la habilidad',
      example: 'pintura',
    },

    nivelHabilidad:{
      type: 'string',
      required: false,
      description: 'nivel de practica',
      example: 'profesional',
    },

    userSkillFK:{
      model: 'User',
    },

  },

};

