require(["vendor/highcharts"], function(charts) {
  console.log('highcharts loaded')

});

require(["vendor/jquery.parse", "vendor/page.router.query"], function(charts) {
  console.log('jquer parse loaded')

});


require(["lib/canvg", "lib/rgbcolor", "lib/svg-download"], function(){
  console.log('canvg loaded')

})


require(["lib/Charty/BackCharty.Component", "lib/Charty/BackCharty.Chart", "appController"], function(){
  console.log('charty loaded')
    console.log('app loaded')

  window.onhashchange = appController.routeFoo;
  appController.routeFoo();
})












