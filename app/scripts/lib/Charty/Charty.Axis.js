(function(){
   window.Charty = window.Charty || {};

  window.Charty.XAxis = Charty.Component.extend({
    registeredChartyAttributes: {
      title:{
        object: function(val){ return({ title: {enabled: true, text: val }}); }
      }
    }
  });

})();
