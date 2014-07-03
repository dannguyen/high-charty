
var appController = window.appController = {};
appController.contentEl = '#the-content';

// http://stackoverflow.com/a/13029597
appController.require_template = function(templateName) {
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
}

appController.renderTemplateUntoPage = function(templateName){
  this.require_template(templateName);
  var tfoo = _.template($('#template_' + templateName).html());

  $(this.contentEl).html(tfoo());
}


appController.clearPage = function(){
  $(this.contentEl).html();
}

appController.chartForm = function(){
  var chart =  new Charty.Chart();
  var lazyUpdate = _.debounce(function(){
      $("#chart-config, #data-config").each(function(){
          var formId = $(this).attr("id");
          if(formId === 'chart-config'){
              var chartyObj = chart;
          }else if(formId === 'data-config'){
              var chartyObj = chart.data();
          }

          $(this).find(".form-control").each(function(){
              if( $(this).prop("tagName") === 'SELECT' ){
                  var val = $(this).find(":selected").attr('value');
              }else{
                  var val = $(this).val();
              }
              var att = $(this).attr('name');

              chartyObj[att](val);
          });
      });


      chart.draw("#chart-container");

  // TK: figure why this is a circular reference    console.log(chart.currentlyDrawnConfig())
  //    $("#chart-json").text(JSON.stringify(chart.currentlyDrawnConfig(), null, 4));

  }, 800);


  $('#chart-config .form-control, #data-config .form-control').change(
      function(){ lazyUpdate(); }
  );

  lazyUpdate();
}
