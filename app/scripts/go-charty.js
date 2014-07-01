
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

    $("#chart-json").text(JSON.stringify(chart.configChartWithData(), null, 4));

}, 800);


$(document).ready(function(){
  $('#chart-config .form-control, #data-config .form-control').change(
    function(){ lazyUpdate(); }
  );

  lazyUpdate();
})
