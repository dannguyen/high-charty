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
    chartyPackager: 'lib/ChartyConfigurer/chartyPackager'

  }
});

requirejs( ['lib/ChartyConfigurer/chartyConfigurerReady'], function(capp){
  window.app = capp;
  console.log('logging app controller');

});









