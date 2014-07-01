



$(document).ready(function(){
  $("#data-samples tbody tr").each(function(){
    var $rawtd = $(this).find(".raw textarea");
    var raw = $rawtd.text();
    var parsedData = $.parse(raw, {header: false}).results;


    /// show parsed as HTML table
    var $parsed = $(this).find(".parsed");
    var tstr = "<table class=\"table table-condensed\">";
    tstr += $.map(parsedData, function(row){
      var s = "<tr>";
      s += $.map(row, function(c){ return "<td>" + c + "</td>"; }).join("");
      s += "</tr>";

      return s;
    }).join("");

    tstr += "</table>";

    $parsed.html(tstr);

    var opts = {
      categories: $rawtd.attr('data-categories'),
      seriesNamed: $rawtd.attr('data-seriesNamed'),
      seriesFormat: $rawtd.attr('data-seriesFormat'),
    }

    // add opts Hash to the table for convenient viewing
    $(this).find(".raw").append("<pre class='req'>" + JSON.stringify(opts, null, "\t") + "</pre>");

    // show parsed as JSON
    var pstr = tkparser(raw, opts);
    $parsed.after("<td><pre>" + pstr + "</pre></td>");

  });

})






function tkparser(rawstr, opts){
  // get an array
  var array = $.parse(rawstr, {header: false}).results;
  // more steps to come


  // determine series-layout
  var seriesFormat = opts.seriesFormat || "row";


  // determine if series has a name
  // true by default
  var seriesNamed = (opts.seriesNamed === 'false' || opts.seriesNamed === false) ? false : true;



  // determine categories
  var categories = null;
  if(!_.isEmpty(opts.categories)){
    // categorical data
    if(opts.categories === 'header'){
      // first row contains the data
      categories = array.shift();
    }
  }


  // by this time, all data has been transposed to row-based format
  var parsedData = { series: [] };
  _.each(array, function(row){
    // configure the series object, which contains:
    // :data (an array of Objects or values)
    var rObj = {};

    if(seriesNamed){ // first column is assumed to have the name
      rObj.name = row.shift();
    }


    // if there is a category, every point is given a name
    rObj.data = _.map(row, function(val, idx){
      var point = { y: val }
      if(categories){ point.name = categories[idx]; }
      return point;
    });



    parsedData.series.push(rObj);
  })


  return JSON.stringify(parsedData, null, 4);
}


