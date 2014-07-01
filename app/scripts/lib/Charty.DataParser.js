(function(){

  var Charty = window.Charty || {}
  var DataParser = Charty.DataParser = function(){

  };


  // returns an Array
  DataParser.prototype.parseRawCSV = function(rawcsv){
    return $.parse(rawcsv, { header: false }).results;
  }

  return DataParser;
})();
