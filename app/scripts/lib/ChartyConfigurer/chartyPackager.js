$(document).ready(function(){
window.ChartyConfigurer.packager = (function(){
  var o = {

  // componentType is a String, e.g. "chart" "na"
  // get a set of attributes, apply any configuration to them
  // return a new Object
    wrap: function(componentType, atts){
      var attsConfig = this.config[componentType];
      var self = this;
      if(_.isUndefined(attsConfig)){ return atts; }

      var wrappedAtts = _.inject(atts, function(memo, attVal, attName){
        var o = self.wrapAtt(attVal, attsConfig[attName]);
        if(!_.isUndefined(o) && o.root === true){
          $.extend(true, memo, o['pkg']);
        }else{
          memo[attName] = o
        }

        return memo;
      }, {});

      return wrappedAtts;
    },

    wrapAtt: function(val, wrapFoo){
      if(_.isUndefined(wrapFoo)){
        return val;
      }else{
        return wrapFoo(val);
      }
    },

    wrapComponentsInJson: function(components){
      var self = this;
      var obj = _.inject(components, function(memo, component){
        console.log(component.componentType + " - " + component.componentName)
        var wrapped = self.wrap(component.componentType, component.attributes);
        memo = $.extend(true, memo, wrapped);
        console.log(wrapped);
        return memo
      }, {});


      return JSON.stringify(obj, null, 4);
    }

  };

  o.config = {};

  o.config.axis = {
    categorical: function(value){
      return { categories: true };
    }
  };

  o.config.chart = {
    stacking: function(value){
      var v = (value === 'stacked') ? 'normal' : null;
      return { root: true, pkg: { plotOptions: { series: { stacking: v } } }};
    },

    width: function(value){
      var v = (value === '100%') ? null : value;
      var obj = { width: v };
      return { attributes: obj };
    }
  };


  o.config.data = {
    seriesColors: function(value){
      var v = _.isArray(value) ? value : (value + '').split(',');
      return v;
    },

    text: function(value){
      var v =  [value + "ASDFOD Ddoo"];
      console.log("VALUE " + v)
      return { root: true, pkg: { series: v }  }
    }
  };


  return ({
    wrap: o.wrap,
    wrapAtt: o.wrapAtt,
    wrapComponentsInJson: o.wrapComponentsInJson,
    config: o.config,
  });

})();


});
