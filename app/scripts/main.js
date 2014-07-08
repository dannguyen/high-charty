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
    underscore: '../bower_components/underscore/underscore',
    jquery_parse: "vendor/jquery.parse",
    page_router_query: "vendor/page.router.query",
    rgbcolor: 'lib/rgbcolor',
    canvg: 'lib/canvg',
    really_simple_colorpicker: '../bower_components/really-simple-colorpicker/jquery.colorPicker.min',
    chartyComponent: 'lib/Charty/Charty.Component',
    chartyData: 'lib/Charty/Charty.Data',
    chartyDataParser: 'lib/Charty/Charty.DataParser',
    chartyAxis: 'lib/Charty/Charty.Axis',
    chartyChart: 'lib/Charty/Charty.Chart',
    svgDownload: 'lib/svg-download'
  }
});

requirejs( ['appController'], function(appController){
  window.app = appController;
  console.log('logging app controller');
  // window.onhashchange = function(){
  //   if(window.location.hash !== '#'){ //ignore anchor triggers
  //     appController.routeFoo();
  //   }else{
  //     console.log('hash change ignored');
  //   }
  // }
  appController.routeFoo();

});









