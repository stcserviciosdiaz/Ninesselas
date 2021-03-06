/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  // '/': {view: 'pages/homepage'},

  '/': {
      view: 'index.html'
    },

  // user

  'POST /user': 'UserController.signup',
  'POST /user/signup': 'UserController.signup',
  'POST /signup': 'UserController.signup',

  'POST /user/login': 'UserController.login',
  'POST /login': 'UserController.login',

  'GET /user': 'UserController.getUsuario',

  'GET /user/getAllUsers': 'UserController.getAllUsers',
  'GET /getAllUsers': 'UserController.getAllUsers',

  'GET /user/getAllCompanies': 'UserController.getAllCompanies',
  'GET /getAllCompanies': 'UserController.getAllCompanies',

  'POST /user/uploadAvatar': 'UserController.uploadAvatar',
  'POST /uploadAvatar': 'UserController.uploadAvatar',

  'GET avatar': 'UserController.avatar',
  'GET /user/avatar': 'UserController.avatar',



  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/


};
