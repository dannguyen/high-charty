define(
  ['underscore', 'backbone', 'jquery', 'chartyParts'],
  function(_, Backbone, $, ChartyParts){

  var ChartyConfigurer = {
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
       return new ChartyParts.SomeComponent(
        _.omit(atts, 'formMetaAttributes', 'componentName'),
               componentType,
               atts.componentName,
               atts.formMetaAttributes
               );
    }
  };

  return ChartyConfigurer;

});
