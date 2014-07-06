require(["vendor/highcharts"], function(charts) {
  console.log('highcharts loaded')

});

require(["vendor/jquery.parse", "vendor/page.router.query"], function(charts) {
  console.log('jquer parse loaded')

});


require(["lib/canvg", "lib/rgbcolor", "lib/svg-download"], function(){

})


require(["lib/Charty/BackCharty.Component", "lib/Charty/BackCharty.Chart"], function(){

})


require(["appController"], function(){
  window.onhashchange = appController.routeFoo;
  appController.routeFoo();
})












