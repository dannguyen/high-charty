(function(){
  window.BackCharty = window.BackCharty || {};


  BackCharty.Component = Backbone.Model.extend({
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


  BackCharty.Data = BackCharty.Component.extend({

    initialize: function(){
      this.parser = new Charty.DataParser();
    },

    // overwrite this
    serializeFormattedAttributes: function(){

    },

    mapOpts: function(hMap, hdrs){
      var self = this;
      var z = _.object(_.zip(hMap, hdrs));
      _.inject(z, function(v, k){
        self[k](v);
      })
      return z;
    },

    parse: function(opts){
      var arrs = this.parser.parseRawCSV(this.rawData());
      // watch out, this modifies arrs, and this._Key() attributes
      var headersMap = arrs[0];
      var headers = arrs[1];


      var dataset = this.parser.arraysToFlatDataSet(arrs, headers);
      // TK this should probably not be passed in, there's no need
      // to overrie it outside of what's done in parseRawCSV
      opts = this.mapOpts(headersMap, headers);

      return this.parser.toHighChartsFormat(dataset.slice(2), opts);
    }





  });

})();
