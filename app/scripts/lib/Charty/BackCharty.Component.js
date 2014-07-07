(function(){
  window.BackCharty = window.BackCharty || {};


  BackCharty.Component = Backbone.Model.extend({

    constructor: function(){
      this.registeredDelegatedAttributes = {};
      this._registerComponents();
      Backbone.Model.apply(this, arguments);
    },
    initialize: function(){

    },

    constructDelegatedAtt: function(compname, attname){
      return compname + attname.charAt(0).toUpperCase() + attname.substring(1);
    },
    registeredComponents: {},
    getRegisteredDelegatedComponent: function(att){
      return this.registeredDelegatedAttributes[att];
    },

    _registerComponents: function(){
      var self = this;
      _.each(self.registeredComponents, function(compHash, compKey){
        var component = new compHash.component();

        _.each(compHash.attributes, function(att){
          camelAtt = self.constructDelegatedAtt(compKey, att);
          console.log("Registering " + compKey + ": " + camelAtt);
          self.registeredDelegatedAttributes[camelAtt] = {component: component, delegatedAttribute: att};
        });
      });
    },

    get: function(att) {
      var c = this.getRegisteredDelegatedComponent(att);
      if(c){
        c.component.get(c.delegatedAttribute);
      }else{
        Backbone.Model.prototype.get.apply(this, arguments);
      }
    },

    set: function(key, val, options) {
      var c = this.getRegisteredDelegatedComponent(key);
      if(c){
        c.component.set(c.delegatedAttribute, val);
      }else{
        Backbone.Model.prototype.set.apply(this, arguments);
      }
    },


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
      if(!_.isUndefined( this.registeredChartyAttributes[key].component ){
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
