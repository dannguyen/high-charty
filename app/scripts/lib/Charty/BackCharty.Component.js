(function(){
  window.BackCharty = window.BackCharty || {};

  BackCharty.Component = Backbone.Model.extend({
    registeredChartyAttributes: { },

    _registeredAndSetAttributes: function(){
      return _.intersection(_.keys(this.registeredChartyAttributes), _.keys(this.attributes));
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
        return valfoo( this.get(key) );
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


  BackCharty.xAxis = BackCharty.Component.extend();

  BackCharty.Data = BackCharty.Component.extend({

    initialize: function(){
      this.parser = new Charty.DataParser();
    },

    // overridding this
    serializeFormattedAttributes: function(){
      return this.parseData();
    },

    mapOpts: function(hMap, hdrs){
      var self = this;
      var z = _.object(_.zip(hMap, hdrs));
      _.each(z, function(v, k){
        self.set(k,v);
      });

      return z;
    },

    parseData: function(){
      var arrs = this.parser.parseRawCSV(this.get('rawData'));
      // watch out, this modifies arrs, and this._Key() attributes
      var headersMap = arrs[0];
      var headers = arrs[1];


      var dataset = this.parser.arraysToFlatDataSet(arrs, headers);
      var opts = this.mapOpts(headersMap, headers);

      return this.parser.toHighChartsFormat(dataset.slice(2), opts);
    }
  });

})();
