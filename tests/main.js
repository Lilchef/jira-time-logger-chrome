require.config({
   baseUrl: "../src/js",
   paths: {
       jquery: "jquery.min",
       jqueryColor: "jquery.color.min",
       text: "require-plugin/text",
       json: "require-plugin/json",
       jasq: "../../tests/lib/jasq",
       mock: "../../tests/mock/"
   },
   shim: {
       jqueryColor: {
            exports: "$",
            deps: ['jquery']
       }
   }
});

require([
    "./spec/App.js",
    "./spec/Config.js",
    "./spec/Jira.js",
    "./spec/Stopwatch.js",
], function () {
    window.jasmine.htmlReporter.initialize();
    window.jasmine.getEnv().execute();
});