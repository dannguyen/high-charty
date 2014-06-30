(function(root, factory) {
  root.Charty = factory(root, {}, _, $);
}(this, function(root, Charty, _, $) {

  Charty.$ = $;



  var Chart = Charty.Chart = function(){
    this.attributes = { data: new Charty.Data() };

    this.data = function(txt){
      if (!arguments.length){
        return this.attributes.data.parse();
      }else{
        this.attributes.data.rawData(txt);

        return this.attributes.data;
      }

    };


  };


  // chart attributes
  var chartAtts = {
    categories: {
      config: function(val){ return({ xAxis: {categories: val }}); }
    },

    height: {
      config: function(val){ return({ chart: { height: val } }); }
    },
    width: {
      config: function(val){ return({ chart: { width: val } }); },
      value: function(val){return val === '100%' ? null : val; }
    },
    chartType: {
      config: function(val){ return({ chart: { type: val } }); }
    },
    arrangement: {
      config: function(val){ return({ plotOptions: { series: {stacking: val} } }); },
      value: function(val){ return val === 'stacked' ? 'normal' : null; }
    },

    xAxisTitle: {
      config: function(val){ return({ xAxis: { title: {enabled: true, text: val }}}) }
    },

    yAxisTitle: {
      config: function(val){ return({ yAxis: { title: {enabled: true, text: val }}}) }
    }
  }

  Chart.prototype.configChart = function(initialHash){
    initialHash = initialHash || {};
    var self = this;
    return _.reduce(chartAtts, function(memo, v, k){
      return $.extend(true, memo, self['config_' + k]() );
    }, initialHash)
  }


  _.extend(Chart.prototype,{
    get: function(attname){
      return this.attributes[attname];
    },


    draw: function(el){

      var config = this.configChart();
      config.series = this.data();

      $(el).highcharts(config);

     return this;
    }
  });


 _.each(chartAtts, function(hsh, method){
    Chart.prototype[method] = function(val){
      this.attributes[method] = val
      return this;
    }

    Chart.prototype["fmt_" + method] = function(){
      var attval = this.get(method);
      var kfoo = hsh['value'] || function(v){ return v; }
      return kfoo(attval);
    };


    Chart.prototype["config_" + method] = function(){
      var attval = this.get(method);
      var kzoo = hsh['config'];
      return kzoo(this["fmt_" + method]());
    }
  });


  return Charty;
}))
