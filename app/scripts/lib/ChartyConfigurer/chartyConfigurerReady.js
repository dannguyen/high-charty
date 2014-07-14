define(
  ['underscore', 'backbone', 'jquery', 'chartyConfigurer', 'chartyPackager', 'chartyParts'],
  function(_, Backbone, $, ChartyConfigurer, ChartyPackager, ChartyParts){


    // need a place to put the templates
    window.template_configAttr = _.template($("#charty-config-attribute").html());

    // read the configuration
    // set up the charts
    $.getJSON('scripts/lib/ChartyConfigurer/chart-config.json', function(chartyconfig){

        var the_el = "#the-form";
        $(the_el).html('');
        ChartyConfigurer.setConfig(chartyconfig);
        window.chart = ChartyConfigurer.initComponent('chart', 'chart', {height: 200});
        window.chartView = new ChartyParts.SomeComponentConfigView({model: chart });

        var databox = ChartyConfigurer.initComponent('data', 'data', {
            seriesColors: "#6699cc,#003366,#EAD333,#3CDABA,#B65A4A"
        });

        var xaxis = ChartyConfigurer.initComponent('axis', 'xAxis' );
        var yaxis = ChartyConfigurer.initComponent('axis', 'yAxis');
        var xaxisView = new ChartyParts.SomeComponentConfigView({model: xaxis });
        var yaxisView = new ChartyParts.SomeComponentConfigView({model: yaxis });
        var dataView = new ChartyParts.SomeComponentConfigView({model: databox });
        $(the_el).append(chartView.render().el)
            .append(xaxisView.render().el)
            .append(yaxisView.render().el)
            .append(dataView.render().el);


        var atts_el = "#the-atts";
        var canonatts = ChartyConfigurer.exportComponents([chart, xaxis, yaxis, databox]);

        $(atts_el).html(ChartyConfigurer.wrapComponentsInJson([chart, xaxis, yaxis, databox]) )

        var json_el = "#the-json";

        $(json_el).html(ChartyPackager.wrapComponentsInJson(canonatts));
    });

    return this;

});
