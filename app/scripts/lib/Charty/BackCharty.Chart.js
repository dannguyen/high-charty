


(function(){
 window.BackCharty.DEFAULT_HIGHCHART_OPTS = {

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





  BackCharty.Chart = BackCharty.Component.extend({

    draw: function(el){
      var exportedConfig = this.exportToHash();
      exportedConfig.series = this.getProcessedData();

      $(el).highcharts($.extend(BackCharty.DEFAULT_HIGHCHART_OPTS, exportedConfig));
    },

    getProcessedData: function(){
      return( [{data: [{ y: 20 }, {y: 8}, {y:31} ] }] );
    }


  });
})();


