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
     return new SomeComponent(
      _.omit(atts, 'formMetaAttributes', 'componentName') , atts.componentName, atts.formMetaAttributes);
  }

};


window.SomeComponent = Backbone.Model.extend({

  initialize: function(attrs, cname, formAtts){
    this.componentName = cname;
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



});
