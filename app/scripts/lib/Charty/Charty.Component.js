define(
  ['underscore', 'backbone', 'jquery'],
  function(_, Backbone, $){

    var Component = Backbone.Model.extend({
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
      return _.reduce(self.formattedAttributes(), function(memo, val, key){
        var obj = self.getFormattedObject(key, val);
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


    formattedAttributes: function(){
      var self = this;
      var regAttKeys = self._registeredAndSetAttributes();

      return _.reduce(regAttKeys, function(memo, key){
        memo[key] = self.getFormattedValue(key)
        return memo;
      }, {});
    },


    rawAttributes: function(){
      var self = this;
      return _.inject( self.attributes, function(memo, val, key){
        if(val.rawAttributes){
          memo[key] = val.rawAttributes();
        }else{
          memo[key] = val
        }
        return memo;
      }, {});
    },

    getFormattedValue: function(key){
      var foo = this.registeredChartyAttributes[key].value;
      if(foo){
        var val = this.get(key);
        return foo(val, this);
      }else{
        return this.get(key);
      }
    },

    getFormattedObject: function(key, val){
      var foo = this.registeredChartyAttributes[key].object;
      if(_.isUndefined(foo)){
        var nestedObj = {};
        nestedObj[key] = val;
        return nestedObj;
      }else{
        return foo( val, this );
      }
    }
  });



   return Component;

  }
);


