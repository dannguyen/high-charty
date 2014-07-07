(function(){
  window.BackCharty = window.BackCharty || {};

  BackCharty.Component = Backbone.Model.extend({
    registeredChartyAttributes: { },

    _registeredAndSetAttributes: function(){
      var atts = this.registeredChartyAttributes;

      var isect = _.intersection(_.keys(atts), _.keys(this.attributes));
      // get required atts
      var reqatts = _.inject(atts, function(memo, h, k){
        if(h.required === true){
          memo.push(k);
        }

        return memo;
      }, []);


      return _.union(reqatts, isect);
    },

    serializeFormattedAttributes: function(){
      var self = this;
      var regAtts = self._registeredAndSetAttributes();
      return _.reduce(regAtts, function(memo, k){
        var obj = self.getFormattedObject(k);
        // if obj is not a Hash, ie it is an Array or other kind of datatype
        //   then wrap it in a Hash
        if( !_.isArray(obj) && _.isEmpty(_.keys(obj)) ){
          var t_obj = { };
          t_obj[k] = obj;

          obj = t_obj;
        }

        return $.extend(true, memo, obj);
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

        return memo;
      }, {});
    },

    getFormattedValue: function(key){
      var valfoo = this.registeredChartyAttributes[key].value;
      if(valfoo){
        var val = this.get(key);
        return valfoo(val, this);
      }else{
        return this.get(key);
      }
    },

    getFormattedObject: function(key){

      var val = this.getFormattedValue(key);
      if(!_.isUndefined( this.registeredChartyAttributes[key].component )){
        var nested_o = {}
        nested_o[key] = val.serializeFormattedAttributes();
        return nested_o;
      }else{
        var foo = this.registeredChartyAttributes[key].object;
        return foo( val );
      }
    }
  });




})();
