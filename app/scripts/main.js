$(document).ready(function(){
  wfoo();
});



wfoo = function(){
  var hashPath = window.location.hash;
  if(hashPath.match(/^#chartUrl/)){
    console.log('start chartUrl/');
    appController.clearPage();
    appController.renderTemplateUntoPage('chartUrl');
    var qm = hashPath.match(/chartUrl\?(.+)/)

    if(qm){
          var querystring = qm[1];
          console.log('query: ' + querystring)
          var queryOpts =  qs.parse(querystring);
          var chart = new Charty.Chart(queryOpts);
          chart.rawData("yKey\nditto\n10\n20\n50\n30");
          chart.draw("#chart-container");
    }else{
      $('#chart-container').html("<p>You must enter a query string</p>")
    }

  }else{
    console.log('chart Form')
    appController.clearPage();
    appController.renderTemplateUntoPage('chartForm')
    appController.chartForm();
  }
}


window.onhashchange = wfoo;






