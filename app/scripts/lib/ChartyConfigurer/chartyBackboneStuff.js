define(
  ['underscore', 'backbone', 'jquery'],
  function(_, Backbone, $){

    var ChartyParts = {};

    ChartyParts.SomeComponent = Backbone.Model.extend({

    initialize: function(attrs, ctype, cname, formAtts){
      this.componentType = ctype;
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
      var cname = this.componentName;
      return _.inject(this.attributes, function(memo, val, key){
        memo[cname + '_' + key] = val;
        return memo;
      }, {});
    }

  })


  ChartyParts.ComponentFormSection = Backbone.View.extend({
    className: "chart-component",
    events: {
      "change .chart-attr":  "attrChanged"
    },
    // template: _.template($("#charty-component").html()),

    initialize: function(){
      _.bindAll(this, 'attrChanged');
      // this.listenTo(this.model, "change", this.render);
    },

    attrChanged: function(e){
      var ctarget = e.currentTarget;
      window.ccct = this;
      var ctarget_attname = ctarget.name.split('_')[1];
      // do typecasting here instead of in the model
      var meta_att = this.model.formAttributes()[ctarget_attname];
      if(meta_att['type'] === 'integer'){
        var nval = Number(ctarget.value)
      }else{
        var nval = ctarget.value
      }

      this.model.set(ctarget_attname, nval);

      this.$el.trigger("chartAttrChanged");
    },
    render: function(){
      var opts = {
        formAttributes: this.model.formAttributes(),
        componentName: this.model.componentName
      }


      this.$el.html(this.template(opts));
      return this;
    }
  });

  return ChartyParts;

});
