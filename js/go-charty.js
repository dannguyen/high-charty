
var chart =  new Charty.Chart();
var lazyUpdate = _.debounce(function(el){

    $(".chart-inputs input").each(function(){
        var val = $(this).val();
        var att = $(this).attr('name');
        chart[att](val);
    });

    chart.data($("#chart-rawData").val());

    chart.draw("#chart-container");

}, 800);


$(document).ready(function(){
  $('.chart-inputs input, #chart-rawData').keyup(
    function(){ lazyUpdate(this); }
  );
})
