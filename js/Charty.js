(function(root, factory) {
  root.Charty = factory(root, {}, _, $);
}(this, function(root, Charty, _, $) {

  var previousChart = root.Charty;
  Charty.$ = $;
  var Chart = Charty.Chart = function(){
    this.attributes = { hi: 'there!',
      series: [{
                 name: 'dan',
                 data: [12, 29.9, 12]
               },

                {
                 name: 'bob',
                 data: [40, 19.9, 6]
               },

            ]
    };
  };

  // chart attributes
  var chartAtts = {
    height: function(val){ return val; },
    series: function(val){ return val; }, // TODO
    width: function(val){ return val === '100%' ? null : val; },
    chartType: function(val){ return val; },
    arrangement: function(val){ return val === 'stacked' ? 'normal' : null; }
  }

  _.each(chartAtts, function(kfoo, method){
    Chart.prototype[method] = function(val){
      this.attributes[method] = val

      return this;
    }

    Chart.prototype["fmt_" + method] = function(){ return kfoo(this.attributes[method]); };
  });

  _.extend(Chart.prototype,{
    get: function(attname){
      return this.attributes[attname];
    },

    fmt: function(attname){
      var val = this.get(attname);
      if(attname === 'arrangement'){
        if(val==='stacked'){
          val = 'normal';
        }else{
          val = null;
        }
      }

      return val;
    },

    draw: function(el){
      var plotOptions = { plotOptions: { series: { stacking: this.fmt_arrangement()  }} };
      var series = { series: this.fmt_series() };
      var chart = { chart: {
        height: this.fmt_height(),
        width: this.fmt_width(),
        type: this.fmt_chartType()
      }};

      var all_opts = _.extend(series, plotOptions, chart);

      $(el).highcharts(all_opts);

     return this;
    }
  });


  return Charty;
}))


// to add:

// - legendPosition
// - xAxisTitle
// - yAxisTitle
// - yAxisSpacing
// - xAxisSpacing
// - addSeries

var Series = function(_data, opts){
  this.data = _data;
  this.name = opts.name ;

  this.format = function(){
    return({
      data: this.data,
      name: this.name
    });
  }
}
