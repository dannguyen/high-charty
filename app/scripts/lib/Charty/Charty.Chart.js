


(function(){
   window.Charty = window.Charty || {};
   window.Charty.DEFAULT_HIGHCHART_OPTS = {

    title: { text: null },
    colors: ['#6699cc','#003366','#EAD333','#3CDABA','#B65A4A'],
    credits: { enabled: false },
    chart: { animation: false,
      style: {
        fontFamily: "'Helvetica Neue', 'Helvetica', Arial, sans-serif",
        fontSize: '13px'
      }
    },
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


  window.Charty.Chart = Charty.Component.extend({
    draw: function(el){
      var exportedConfig = this.serializeFormattedAttributes();

      $(el).highcharts($.extend(true, window.Charty.DEFAULT_HIGHCHART_OPTS, exportedConfig));
    },


    registeredChartyAttributes: {
      data: {
        required: true,
        value: function(val, self){
          var d = new Charty.Data({rawData: self.get('rawData')});
          return d.parseData();
        },

        object: function(val){
          return( {series: val });
        },

      },

      xAxis: {
        required: true,
        value: function(val, sbind){
          var c = new window.Charty.XAxis({
            title: sbind.get('xAxisTitle') }
          );
          return c.serializeFormattedAttributes();
        },

        object: function(val){
          return( { xAxis: val });
        }
      },

      colors: {
        object: function(val){ return({ colors: val })},
        value: function(val){
          // assume it to be either an Array or a comma-delimited string
          return _.isArray(val) ? val : (val + '').split(',');
        }
      },

      height: {
        object: function(val){ return({ chart: { height: val } }); }
      },
      width: {
        object: function(val){ return({ chart: { width: val } }); },
        value: function(val){return val === '100%' ? null : val; }
      },
      chartType: {
        object: function(val){ return({ chart: { type: val } }); }
      },
      stackType: {
        object: function(val){ return({ plotOptions: { series: {stacking: val} } }); },
        value: function(val){
          if(val === 'stacked'){ return 'normal'; }
          else{ return null; }
        }
      },


      yAxisTitle: {
        object: function(val){ return({ yAxis: { title: {enabled: true, text: val }}}) }
      },

      yAxisMin: {
        object: function(val){ return({yAxis: {min: val }})},
        value: function(val){
          if(val === 'auto'){ return null; }
          else{ return val; }
        }
      },

      yAxisTickPixelInterval: {
        object: function(val){
          return({
            yAxis: { tickPixelInterval: val }
          });
        }
      }
    }
  });






})();


