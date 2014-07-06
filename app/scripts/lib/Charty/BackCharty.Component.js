(function(){
  window.BackCharty = window.BackCharty || {};


  var Component = BackCharty.Component = Backbone.Model.extend({

    registeredChartyAttributes: { },

    registeredAndSetAttributes: function(){
      return _.intersection(_.keys(this.registeredChartyAttributes), _.keys(this.attributes));
    },

    serializeFormattedAttributes: function(){
      var self = this;
      var regAtts = self.registeredAndSetAttributes();
      return _.reduce(regAtts, function(memo, k){
        return $.extend(true, memo, self.getFormattedObject(k) );
      }, {});
    },

    serializeRawAttributes: function(){
      var self = this;
      return _.inject( self.attributes, function(memo, val, key){
        if(val.serializeRawAttributes){
          memo[key] = val.serializeRawAttributes();
        }else{
          memo[key] = val
        }

        return memo
      }, {});
    },



    getFormattedValue: function(key){
      var valfoo = this.registeredChartyAttributes[key].value;
      if(valfoo){
        return valfoo( this.get(key) );
      }else{
        return this.get(key);
      }
    },

    getFormattedObject: function(key){
      var foo = this.registeredChartyAttributes[key].object;
      var val = this.getFormattedValue(key);
      if(foo === 'component'){
        var nested_o = {}
        nested_o[key] = val.serializeFormattedAttributes();
        return nested_o;
      }else{
        return foo( val );
      }
    }


  });
})();
