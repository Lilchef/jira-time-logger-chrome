/**
 * require-setup.js file
 *
 * Contains the config for RequireJS for the app
 *
 * @author Aaron Baker <me@aaronbaker.co.uk>
 * @copyright Aaron Baker 2014
 */

require.config({
   baseUrl: "js",
   paths: {
       jquery: "jquery.min",
       jqueryColor: "jquery.color.min",
       text: "require-plugin/text",
       json: "require-plugin/json"
   },
   shim: {
       jqueryColor: {
            exports: "$",
            deps: ['jquery']
       }
   }
});