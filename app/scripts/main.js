require(["vendor/highcharts"], function(charts) {
  console.log('highcharts loaded')

});

require(["vendor/jquery.parse", "vendor/page.router.query"], function(charts) {
  console.log('jquer parse loaded')

});


require(["lib/canvg", "lib/rgbcolor", "lib/svg-download"], function(){
  console.log('canvg loaded')

})


require(["lib/Charty/Charty.Component",
  "lib/Charty/Charty.DataParser",
  "lib/Charty/Charty.Chart",
  "lib/Charty/Charty.Data", "lib/Charty/Charty.Axis",  "appController"], function(){
  console.log('app loaded')

  window.onhashchange = window.appController.routeFoo;
  window.appController.routeFoo();
})












