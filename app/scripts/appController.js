// define(['jquery', 'underscore', 'backbone', 'chartyChart'], function($, _, Backbone, Chart){

//   return({
//     hello: 'world!',
//     uscore: _,
//     jq: $,
//     bbq: Backbone
//     // chart: Chart
//   });
// });

define(['jquery', 'underscore', 'chartyChart', 'page_router_query', 'rgbcolor', 'canvg', 'really_simple_colorpicker', 'svgDownload'],
  function($, _, Chart, qs){

    var contentEl = '#the-content',
        clearPage = function(){
          $(contentEl).html("");
        },
        chart = null,

        routeFoo = function(){
          var hashPath = window.location.hash;
          if(hashPath.match(/^#charts/)){
            console.log('start chartUrl/');
            clearPage();
            renderTemplateUntoPage('chartUrl');
            var qm = hashPath.match(/charts\?(.+)/)
            if(qm){
              var querystring = qm[1];
              console.log('query: ' + querystring)
              var queryOpts =  qs.parse(querystring);
              chart = new Chart(queryOpts);
              chart.draw("#chart-container");
            }else{
              $('#chart-container').html("<p>You must enter a query string</p>")
            }

          }else{
            console.log('chart Form')
            clearPage();
            renderTemplateUntoPage('chartForm')
            chartForm();
          }
        },

        require_template = function(templateName) {
          var template = $('#template_' + templateName);
          if (template.length === 0) {
            var tmpl_dir = '/templates';
            var tmpl_url = tmpl_dir + '/' + templateName + '.html';
            var tmpl_string = '';

            $.ajax({
                url: tmpl_url,
                method: 'GET',
                async: false,
                contentType: 'text',
                success: function (data) {
                    tmpl_string = data;
                }
            });

            $('head').append('<script id="template_' +
            templateName + '" type="text/template">' + tmpl_string + '<\/script>');
          }
        },

        renderTemplateUntoPage = function(templateName){
          require_template(templateName);
          var tfoo = _.template($('#template_' + templateName).html());

          $(contentEl).html(tfoo());
        },



        chartForm = function(){
          chart =  new Chart();
          var lazyUpdate = _.debounce(function(){
            console.log('lazyupdate happening')
            $("#chart-config").find(".form-control").each(function(){
                    if( $(this).prop("tagName") === 'SELECT' ){
                        var val = $(this).find(":selected").attr('value');
                    }else{
                        var val = $(this).val();
                    }
                    var att = $(this).attr('name');

                    chart.set(att, val);
             });



             $("#raw-chart-json").text(JSON.stringify(chart.rawAttributes(), null, 4));
             $("#formatted-chart-json").text(JSON.stringify(chart.serializeFormattedAttributes(), null, 4));

             chart.draw("#chart-container");
             $("#chart-container").append("<a href=\"/#charts?" + $.param(chart.rawAttributes()) + "\">Chart URL</a>");

          }, 800);


        $('#chart-config .form-control').change(
            function(){ lazyUpdate(); }
        );

        lazyUpdate();
      };




      return(
        {
          routeFoo: routeFoo,
          chart: chart
        }
      );


  }
);



