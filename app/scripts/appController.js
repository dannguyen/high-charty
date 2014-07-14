define(['underscore', 'backbone', 'jquery', 'highcharts', 'templater',
        'page_router_query', 'chartyConfigurer', 'chartyPackager', 'chartyParts'],
  function(_, Backbone, $, highcharts, templater, qs, ChartyConfigurer, ChartyPackager, ChartyParts){

    var h = {};

    h.contentEl = '#the-content';
    h.clearPage = function(){
      $(this.contentEl).html("");
    };

    h.routeHandler = function(){
      var hashPath = window.location.hash;
      if(hashPath.match(/^#charts/)){
        this.routeToChartURL(hashPath);
      }else{
        this.routeToChartForm();
      }
    };

    h.routeToChartForm = function(){
      this.clearPage();
      console.log('start chartForm/');
      this.renderTemplateUntoPage("chartForm");

      $.getJSON('scripts/lib/ChartyConfigurer/chart-config.json', function(chartyconfig){

        var chartyComponent = templater.compileTemplate('chartyComponent');

        ChartyConfigurer.setConfig(chartyconfig);
        var chart = ChartyConfigurer.initComponent('chart', 'chart', {height: 600});
        var chartView = new ChartyParts.ComponentFormSection({model: chart});
        var data = ["seriesKey,categoryKey,yKey,nothing",
                    "fruit,season,quantity,price",
                    "Apples,Fall,48,1.00",
                    "Apples,Winter,82,1.50",
                    "Oranges,Fall,34,2.25",
                    "Oranges,Winter,98,3.58",
                    "Pears,Fall,45,1.75",
                    "Pears,Winter,149,2.10"].join("\n")

        var data = ChartyConfigurer.initComponent('data', 'data', {
            text: data,
            seriesColors: "#6699cc,#003366,#EAD333,#3CDABA,#B65A4A"
        });

        var xaxis = ChartyConfigurer.initComponent('axis', 'xAxis' );
        var yaxis = ChartyConfigurer.initComponent('axis', 'yAxis');
        var xaxisView = new ChartyParts.ComponentFormSection({model: xaxis });
        var yaxisView = new ChartyParts.ComponentFormSection({model: yaxis });
        var dataView = new ChartyParts.ComponentFormSection({model: data });

        chartView.template = chartyComponent, xaxisView.template = chartyComponent,
        yaxisView.template = chartyComponent, dataView.template = chartyComponent;

        $("#the-form").append(chartView.render().el)
            .append(xaxisView.render().el)
            .append(yaxisView.render().el)
            .append(dataView.render().el)
            .find(".chart-component").wrap("<div class='col-sm-6'></div>");

        var renderOnChange = function(){
          $("#the-atts").html(ChartyConfigurer.wrapComponentsInJson([chart, xaxis, yaxis, data]) )

          var canonatts = ChartyConfigurer.exportComponents([chart, xaxis, yaxis, data]);

          var chart_params = ChartyConfigurer.exportAttsToURL(canonatts);
          $("#the-url-params").text(chart_params);
          $("#the-url-w-params").html("<a href=\"#charts?" + chart_params + " \">Chart URL</a>")

          $("#the-json").html(ChartyPackager.wrapComponentsInJson(canonatts));
          $("#the-chart").highcharts(ChartyPackager.exportChartOptions(canonatts));


        };


        $(".chart-component").on("chartAttrChanged", renderOnChange);

        renderOnChange();


      });

//      var chartycomponent = templater.compileTemplate("chartyComponent");

    };

    h.renderTemplateUntoPage = function(tname){
      var tfoo = templater.compileTemplate(tname);
      $(this.contentEl).html(tfoo());
    }

    h.routeToChartURL = function(hashPath){
      this.clearPage();
      this.renderTemplateUntoPage("chartUrl");

      console.log('start chartUrl/');
      var qm = hashPath.match(/charts\?(.+)/)
      if(qm){
        var querystring = qm[1];
        console.log('query: ' + querystring)
        var queryOpts =  qs.parse(querystring);
        console.log(queryOpts);

        var chartOpts = ChartyPackager.exportChartOptions(queryOpts);
        console.log(chartOpts)

        $("#the-chart").highcharts(chartOpts);

      }else{
        $('#the-chart').html("<p>You must enter a query string</p>")
      }
    };




    return h;
  }
);


// define(['jquery', 'underscore', 'backbone', 'chartyChart', 'page_router_query', 'rgbcolor', 'canvg', 'really_simple_colorpicker', 'svgDownload'],
//   function($, _, Backbone, Chart, qs){

//     var contentEl = '#the-content',
//         clearPage = function(){
//           $(contentEl).html("");
//         },
//         chart = null,

//         routeFoo = function(){
//           var hashPath = window.location.hash;
//           if(hashPath.match(/^#charts/)){
//             console.log('start chartUrl/');
//             clearPage();
//             renderTemplateUntoPage('chartUrl');
//             var qm = hashPath.match(/charts\?(.+)/)
//             if(qm){
//               var querystring = qm[1];
//               console.log('query: ' + querystring)
//               var queryOpts =  qs.parse(querystring);
//               chart = new Chart(queryOpts);
//               chart.draw("#chart-container");
//             }else{
//               $('#chart-container').html("<p>You must enter a query string</p>")
//             }

//           }else{
//             console.log('chart Form')
//             clearPage();
//             renderTemplateUntoPage('chartForm')
//             chartForm();
//           }
//         },

//         require_template = function(templateName) {
//           var template = $('#template_' + templateName);
//           if (template.length === 0) {
//             var tmpl_dir = '/templates';
//             var tmpl_url = tmpl_dir + '/' + templateName + '.html';
//             var tmpl_string = '';

//             $.ajax({
//                 url: tmpl_url,
//                 method: 'GET',
//                 async: false,
//                 contentType: 'text',
//                 success: function (data) {
//                     tmpl_string = data;
//                 }
//             });

//             $('head').append('<script id="template_' +
//             templateName + '" type="text/template">' + tmpl_string + '<\/script>');
//           }
//         },

//         renderTemplateUntoPage = function(templateName){
//           require_template(templateName);
//           var tfoo = _.template($('#template_' + templateName).html());

//           $(contentEl).html(tfoo());
//         },



//         chartForm = function(){
//           chart =  new Chart();
//           var lazyUpdate = _.debounce(function(){
//             console.log('lazyupdate happening')
//             $("#chart-config").find(".form-control").each(function(){
//                     if( $(this).prop("tagName") === 'SELECT' ){
//                         var val = $(this).find(":selected").attr('value');
//                     }else{
//                         var val = $(this).val();
//                     }
//                     var att = $(this).attr('name');

//                     chart.set(att, val);
//              });



//              $("#raw-chart-json").text(JSON.stringify(chart.rawAttributes(), null, 4));
//              $("#formatted-chart-json").text(JSON.stringify(chart.serializeFormattedAttributes(), null, 4));

//              chart.draw("#chart-container");
//              $("#chart-container").append("<a href=\"/#charts?" + $.param(chart.rawAttributes()) + "\">Chart URL</a>");

//           }, 800);


//         $('#chart-config .form-control').change(
//             function(){ lazyUpdate(); }
//         );

//         lazyUpdate();
//       };




//       return(
//         {
//           routeFoo: routeFoo,
//           chart: chart
//         }
//       );


//   }
// );



