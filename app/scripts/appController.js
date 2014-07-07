(function(){
  window.appController = {
   contentEl: '#the-content',

  clearPage: function(){
    $(this.contentEl).html("");
  },

   routeFoo: function(){
    var hashPath = window.location.hash;
    if(hashPath.match(/^#charts/)){
      console.log('start chartUrl/');
      this.clearPage();
      this.renderTemplateUntoPage('chartUrl');
      var qm = hashPath.match(/charts\?(.+)/)

      if(qm){
            var querystring = qm[1];
            console.log('query: ' + querystring)
            var queryOpts =  qs.parse(querystring);
            window.chart = new Charty.Chart(queryOpts);
            chart.draw("#chart-container");
      }else{
        $('#chart-container').html("<p>You must enter a query string</p>")
      }

    }else{
      console.log('chart Form')
      this.clearPage();
      this.renderTemplateUntoPage('chartForm')
      this.chartForm();
    }
  },


  // http://stackoverflow.com/a/13029597
  require_template: function(templateName) {
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

  renderTemplateUntoPage: function(templateName){
    this.require_template(templateName);
    var tfoo = _.template($('#template_' + templateName).html());

    $(this.contentEl).html(tfoo());
  },



  chartForm: function(){
    window.chart =  new Charty.Chart();
    var lazyUpdate = _.debounce(function(){
        $("#chart-config").each(function(){
            var formId = $(this).attr("id");
            if(formId === 'chart-config'){
                var chartyObj = chart;
            }
            // deprecated
            // }else if(formId === 'data-config'){
            //     var chartyObj = chart.data();
            // }

            $(this).find(".form-control").each(function(){
                if( $(this).prop("tagName") === 'SELECT' ){
                    var val = $(this).find(":selected").attr('value');
                }else{
                    var val = $(this).val();
                }
                var att = $(this).attr('name');

                chartyObj.set(att, val);
            });
        });


        chart.draw("#chart-container");

       $("#raw-chart-json").text(JSON.stringify(chart.serializeRawAttributes(), null, 4));
       $("#formatted-chart-json").text(JSON.stringify(chart.serializeFormattedAttributes(), null, 4));
       $("#chart-container").append("<a href=\"/#charts?" + $.param(chart.serializeRawAttributes()) + "\">Chart URL</a>");
    }, 800);


    $('#chart-config .form-control, #data-config .form-control').change(
        function(){ lazyUpdate(); }
    );

    lazyUpdate();
  }




  };


})();
