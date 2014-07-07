(function(){
  window.Charty = window.Charty || {};

  window.Charty.Axis = Charty.Component.extend({
    defaults: {
      minValue: 0,
      tickPixelInterval: 100
    },

    registeredChartyAttributes: {
      title: {
        object: function(val){ return({ title: {enabled: true, text: val }}); }
      },

      categories: {
        object: function(val){
          if(val === true){
            return { categories: true };
          }else{
            return({});
          }
        }
      },

      minValue: {
        value: function(val){
          if(val === 'auto'){ return null; }
          else{ return val; }
        },
        object: function(val){
          return({
            tickPixelInterval: val
          });
        }
      },

      tickPixelInterval: {
        object: function(val){
          return({
            tickPixelInterval: val
          });
        }
      },
    }
  });


  window.Charty.CategoricalAxis = Charty.Axis.extend({
    defaults: {
      minValue: 0,
      tickPixelInterval: 100,
      categories: true
    }
  });



})();
