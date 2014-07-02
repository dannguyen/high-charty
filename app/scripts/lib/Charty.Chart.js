(function(){

  var Charty = window.Charty || {};

  var DEFAULT_HIGHCHART_OPTS = {
    title: { text: null },
    credits: { enabled: false },
    chart: { animation: false },
    plotOptions: { series: {animation: false }},
    tooltip: {
      enabled: true,
      formatter: function(){
        var str = "<b>" +  this.series.name + ": </b>";
        str += "<br>" + this.x;
        str += ", " + this.y;

        return str;
      }
    }
  }

  var Chart = Charty.Chart = function(){
    this.attributes = { data: new Charty.Data() };
    this.defaultConfig = DEFAULT_HIGHCHART_OPTS;

    this.data = function(txt){
      return this.attributes.data;
    };
  };

  Chart.prototype.configAccessors = {
    colors: {
      config: function(val){ return({ colors: val })},
      value: function(val){
        // assume it to be either an Array or a comma-delimited string
        return _.isArray(val) ? val : val.split(',');
      }
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
    stackType: {
      config: function(val){ return({ plotOptions: { series: {stacking: val} } }); },
      value: function(val){
        if(val === 'stacked'){ return 'normal'; }
        else{ return null; }
      }
    },

    xAxisTitle: {
      config: function(val){ return({ xAxis: { title: {enabled: true, text: val }}}) }
    },

    yAxisTitle: {
      config: function(val){ return({ yAxis: { title: {enabled: true, text: val }}}) }
    },

    yAxisTickPixelInterval: {
      config: function(val){
        return({
          yAxis: { tickPixelInterval: val }
        });
      }
    }

  }

  Chart.prototype.configChart = function(initialHash){
    initialHash = initialHash || {};
    var h = $.extend(true, {}, this.defaultConfig);
    h = $.extend(true, h, initialHash);
    var self = this;

    return _.reduce(this.configAccessors, function(memo, v, k){
      return $.extend(true, memo, self['config_' + k]() );
    }, h)
  }

  Chart.prototype.configChartWithData = function(h){
    var c = this.configChart(h);
    c.series =  this.data().parse();

   // adjust Chart attributes based on data structure
   // TK-spaghetti there has to be a better place to do this
    if(this.data().hasCategories()){
      $.extend(c, { xAxis: { categories: true  } })
    }

    return c;
  }


  _.extend(Chart.prototype,{
    draw: function(el){
      var config = this.configChartWithData();
      $(el).highcharts(config);

     return this;
    }
  });


 _.each(Chart.prototype.configAccessors, function(hsh, method){
    Chart.prototype[method] = function(value){
      if (!arguments.length){

        return this.attributes[method];
      }else{
        this.attributes[method] = value;

        return this;
      }
    }

    Chart.prototype["fmt_" + method] = function(){
      var attval = this[method]();
      var kfoo = hsh['value'] || function(v){ return v; }
      return kfoo(attval);
    };

    Chart.prototype["config_" + method] = function(){
      var attval = this[method]();
      var kzoo = hsh['config'];
      return kzoo(this["fmt_" + method]());
    }
  });



})();
