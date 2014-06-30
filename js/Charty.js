(function(root, factory) {
  root.Charty = factory(root, {}, _, $);
}(this, function(root, Charty, _, $) {

  Charty.$ = $;


  // var ChartModule = Charty.ChartModule = function(){
  //   this.attributes = {};
  //   this.defaultConfig = {};
  //   this.configAccessors = {};
  //   // this.initialize.apply(this, arguments);

  // };


    // _.extend(ChartModule, {
    //   initialize: function(){ }
    // })


  return Charty;
}))
