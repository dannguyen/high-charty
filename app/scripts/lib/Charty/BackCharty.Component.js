(function(){
  window.BackCharty = window.BackCharty || {};


  var Component = BackCharty.Component = Backbone.Model.extend({

    registeredChartyAttributes: { },

    exportToHash: function(){
      var self = this;
      var regAtts = _.keys(self.registeredChartyAttributes);
      return _.reduce(regAtts, function(memo, k){
        return $.extend(true, memo, self.getExportedObject(k) );
      }, {});
    },

    getExportedValue: function(key){
      var valfoo = this.registeredChartyAttributes[key].value;
      if(valfoo){
        return valfoo( this.get(key) );
      }else{
        return this.get(key);
      }
    },

    getExportedObject: function(key){
      var valfoo = this.registeredChartyAttributes[key].object;

      return valfoo( this.getExportedValue(key));
    }


  });
})();
