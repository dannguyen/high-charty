// TO DO:
// grab the flattenedAttributes from the structure
// THEN process them one by one


define(
  ['underscore', 'backbone', 'jquery'],
  function(_, Backbone, $){

    var ChartyPackager = (function(){
      var o = {

        convert: function(atts){
          var config = this.config;
          var convertedAtts = _.inject(atts, function(memo, attVal, attName){
            var mash = {};
            var attFoo = config[attName];
            console.log(attName)
            if(_.isUndefined(attFoo)){
              // return a conventional hash
              var z = attName.split('_');
              var _h = {};
              _h[z[1]] = attVal;
              mash[z[0]] = _h; // e.g. {chart: {something: someVal }}
            }else{
              console.log('attfoo')
              console.log(attFoo);
              mash = attFoo(attVal);
            }

            return $.extend(true, memo, mash);
          }, {});

          return convertedAtts;
        },


        wrapComponentsInJson: function(canonAttributes){
          var obj = this.convert(canonAttributes)

          return JSON.stringify(obj, null, 4);
        }

      };

      o.config = {
        xAxis_categorical: function(value){
          return { categories: true };
        },

        chart_stacking: function(value){
          var v = (value === 'stacked') ? 'normal' : null;
          return  { plotOptions: { series: { stacking: v } } };
        },

        chart_width: function(value){
          var v = (value === '100%') ? null : value;
          var obj = { width: v };
          return obj;
        },

        data_seriesColors: function(value){
          var v = _.isArray(value) ? value : (value + '').split(',');
          return  {chart: { colors: v }};
        },

        data_text: function(value){
          var v =  [value + "ASDFOD Ddoo"];
          return  { series: v } ;
        }


      };


      return ({
        convert: o.convert,
        config: o.config,
        wrapComponentsInJson: o.wrapComponentsInJson
      });

    })();


    return ChartyPackager;
  }
);



      // o.config.axis = {
      //   categorical: function(value){
      //     return { categories: true };
      //   }
      // };

      // o.config.chart = {
      //   stacking: function(value){
      //     var v = (value === 'stacked') ? 'normal' : null;
      //     return { root: true, pkg: { plotOptions: { series: { stacking: v } } }};
      //   },

      //   width: function(value){
      //     var v = (value === '100%') ? null : value;
      //     var obj = { width: v };
      //     return obj;
      //   }
      // };


      // o.config.data = {
      //   seriesColors: function(value){
      //     var v = _.isArray(value) ? value : (value + '').split(',');
      //     return { root: true, pkg: {chart: { colors: v }}};
      //   },

      //   text: function(value){
      //     var v =  [value + "ASDFOD Ddoo"];
      //     return { root: true, pkg: { series: v }  }
      //   }
      // };
