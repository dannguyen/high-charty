requirejs.config({
  baseUrl: 'scripts',
  shim: {
        'backbone': {
            //These script dependencies should be loaded before loading
            //backbone.js
            deps: ['underscore', 'jquery'],
            //Once loaded, use the global 'Backbone' as the
            //module value.
            exports: 'Backbone'
        },

        'highcharts': {
            deps: ['jquery'],
            exports: 'highcharts'
        },

        'underscore': {
            exports: '_'
        },

        'jquery_parse': {
          deps: ['jquery']
        },

        'page_router_query': {
          exports: 'qs'
        }
    },

  paths: {
    backbone: '../bower_components/backbone/backbone',
    highcharts: 'vendor/highcharts',
    jquery: 'vendor/jquery',
    jquery_parse: "vendor/jquery.parse",
    underscore: '../bower_components/underscore/underscore',
    chartyParts: 'lib/ChartyConfigurer/chartyBackboneStuff',
    chartyConfigurer: 'lib/ChartyConfigurer/chartyConfigurer',
    chartyPackager: 'lib/ChartyConfigurer/chartyPackager',
    page_router_query: "vendor/page.router.query"
  }
});

requirejs( ['appController'], function(app){
  window.app = app;
  console.log('logging app controller');
  app.routeHandler();

});









