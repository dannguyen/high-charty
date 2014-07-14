define(
  ['underscore', 'backbone', 'jquery'],
  function(_, Backbone, $){

    var ChartyParts = {};

    ChartyParts.SomeComponent = Backbone.Model.extend({

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
      var cname = this.componentName;
      return _.inject(this.attributes, function(memo, val, key){
        memo[cname + '_' + key] = val;
        return memo;
      }, {});
    }

  })


  ChartyParts.SomeComponentConfigView = Backbone.View.extend({
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

      console.log("Component " + this.model.componentType + ": " +
                    this.model.componentName + " rendering...")
      console.log(opts)

      this.$el.html(this.template(opts));
      return this;
    }
  });

  return ChartyParts;

});
