$(document).ready(function(){

window.ChartyConfigurer = {
  setConfig: function(obj){
    this.components = obj;
  },

  createComponentAttHash: function(componentName, customComponentName, initalAttValues){
     // by default, customName is the same as componentName, e.g. 'chart'
     // but can be set to something like, 'xAxis'

     var c = this.components[componentName];
     actualComponentName = customComponentName || componentName;
     var hsh = {componentName: actualComponentName, formMetaAttributes: {} };
     var self = this;
     _.each(c.attributes, function(att){
       hsh[att.name] = initalAttValues[att.name] || att.defaultValue;
       hsh.formMetaAttributes[att.name] = self.setComponentFormAtt(att, actualComponentName);
     })

     return hsh;
  },

  setComponentFormAtt: function(orgatt, customname){
      var att = _.clone(orgatt);
      if(_.isArray(att.values)){
          att.optType = "select";
      }else if(att.type === 'text'){
          att.optType = "text";
      }else if(att.type === 'boolean'){
          att.optType = 'checkbox';
      }else{
          att.optType = "input";
      }

      att.fullname = customname + "_" + att.name;

      return att;
  },



  canonicalAttName: function(att, cname){
    return cname + '_' + att.name;
  },

  initComponent: function(componentType, customName, initialAtts){
     initialAtts = initialAtts || {};

     var atts = this.createComponentAttHash(componentType, customName, initialAtts);
     console.log("creating componentType: " + componentType)
     return new SomeComponent(
      _.omit(atts, 'formMetaAttributes', 'componentName'),
             componentType,
             atts.componentName,
             atts.formMetaAttributes
             );
  }

};


window.SomeComponent = Backbone.Model.extend({

  initialize: function(attrs, ctype, cname, formAtts){
    this.componentType = ctype;
    this.componentName = cname;
    console.log("initializing componentType: " + this.componentType)
    this.formMetaAttributes = formAtts;

  },

  // returns a Hash that contains the attribute configuration plus the value
  formAttributes: function(){
    var chsh = this.formMetaAttributes;
    var compname = this.componentName;

    return _.inject(this.attributes, function(memo, val, key){
      var hconfig = chsh[key];
      hconfig.value = val;
      hconfig.fullname = compname + '_' + key;
      memo[key] = hconfig

      return memo;
    }, {})
  },


  getConfig: function(attname){
    return this.formMetaAttributes[attname]
  },

  canonicalAttributes: function(){
    var cname = this.get('componentName');
    return _.inject(this.chartAttributes(), function(memo, val, key){
      memo[cname + '_' + key] = val;
      return memo;
    }, {});
  }

})


window.SomeComponentConfigView = Backbone.View.extend({
  className: "chart-component",
  template: _.template($("#charty-component").html()),

  initialize: function(){
    this.listenTo(this.model, "change", this.render);
  },

  render: function(){
    var opts = {
      formAttributes: this.model.formAttributes(),
      componentName: this.model.componentName
    }

    console.log("Component " + this.model.componentName + " rendering...")
    console.log(opts)
    this.$el.html(this.template(opts));

    return this;
  }
});




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
        console.log(component.componentType)
        var wrapped = self.wrap(component.componentType, component.attributes);
        memo = $.extend(true, memo, wrapped);

        return memo
      }, {z: 3});


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


  o.data = {
    seriesColors: function(value){
      var v = _.isArray(value) ? value : (value + '').split(',');
      return v;
    },

    text: function(value){
      var v =  fooparsedData(v)
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
