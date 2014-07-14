define(
  ['underscore', 'backbone', 'jquery', 'highcharts', 'chartyConfigurer', 'chartyPackager', 'chartyParts'],
  function(_, Backbone, $, highcharts, ChartyConfigurer, ChartyPackager, ChartyParts){

    // need a place to put the templates
    // TK move this some where else int he view
    window.template_configAttr = _.template($("#charty-config-attribute").html());

    // read the configuration
    // set up the charts
    $.getJSON('scripts/lib/ChartyConfigurer/chart-config.json', function(chartyconfig){

        var the_el = "#the-form";
        $(the_el).html('');
        ChartyConfigurer.setConfig(chartyconfig);
        window.chart = ChartyConfigurer.initComponent('chart', 'chart', {height: 600});
        window.chartView = new ChartyParts.ComponentFormSection({model: chart });


        var data = ["seriesKey,categoryKey,yKey,nothing",
        "fruit,season,quantity,price",
        "Apples,Fall,48,1.00",
        "Apples,Winter,82,1.50",
        "Oranges,Fall,34,2.25",
        "Oranges,Winter,98,3.58",
        "Pears,Fall,45,1.75",
        "Pears,Winter,149,2.10"].join("\n")

        var databox = ChartyConfigurer.initComponent('data', 'data', {
            text: data,
            seriesColors: "#6699cc,#003366,#EAD333,#3CDABA,#B65A4A"
        });

        var xaxis = ChartyConfigurer.initComponent('axis', 'xAxis' );
        var yaxis = ChartyConfigurer.initComponent('axis', 'yAxis');
        var xaxisView = new ChartyParts.ComponentFormSection({model: xaxis });
        var yaxisView = new ChartyParts.ComponentFormSection({model: yaxis });
        var dataView = new ChartyParts.ComponentFormSection({model: databox });


          $(the_el).append(chartView.render().el)
              .append(xaxisView.render().el)
              .append(yaxisView.render().el)
              .append(dataView.render().el)
              .find(".chart-component").wrap("<div class='col-sm-6'></div>");


        var renderOnChange = function(){
          console.log("renderonchange")
          var atts_el = "#the-atts";
          var canonatts = ChartyConfigurer.exportComponents([chart, xaxis, yaxis, databox]);
          console.log(canonatts)
          $(atts_el).html(ChartyConfigurer.wrapComponentsInJson([chart, xaxis, yaxis, databox]) )

          var json_el = "#the-json";

          $(json_el).html(ChartyPackager.wrapComponentsInJson(canonatts));

          $("#the-chart").highcharts(ChartyPackager.exportChartOptions(canonatts));
        };


        $(".chart-component").on("chartAttrChanged", renderOnChange);

        renderOnChange()
    });




    return this;

});
