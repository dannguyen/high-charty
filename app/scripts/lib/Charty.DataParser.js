(function(){

  var Charty = window.Charty || {}
  var DataParser = Charty.DataParser = function(){

  };


  // returns an Array
  DataParser.prototype.parseRawCSV = function(rawcsv){
    return $.parse(rawcsv, { header: false }).results;
  }

  DataParser.prototype.transposeArray = function(arr){
    return Object.keys(arr[0]).map(
      function (c) { return arr.map(function (r) { return r[c]; }); }
    );
  }


  return DataParser;
})();
