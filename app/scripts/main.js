$(document).ready(function(){
  console.log('main.js');
  var hashPath = window.location.hash;
  if(hashPath.match(/^#chart/)){
    console.log(hashPath);
    page('/' + hashPath.slice(1));

  }else{
    console.log('hello')
    page();
  }
});
