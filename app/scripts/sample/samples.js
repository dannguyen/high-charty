$(document).ready(function(){

  var parser = new Charty.DataParser();
  console.log('hey');
  var $table = $("#data-samples");

  $.getJSON("scripts/sample/examples.json", function(data){
    for(var i = 0, len = data.length; i < len; i++){
      var row = data[i];
      var dataOpts = row.dataOptions;
      var chartOpts = row.chartyOptions; // not used...yet
      var _a = parser.parseRawCSV(row.rawData);
      var _a0 = _a.shift();
      var _b = parser.arraysToFlatDataSet(_a, _a0);
      var _c = parser.toHighChartsFormat(_b, dataOpts );


      var str = "<section class=\"sec example\"><h3>" + row.title + "</h3>" + "<div class=\"row\">";
        // first column
        str += "<div class=\"col-sm-4\">" +
              "<textarea cols='40' rows='10'>" + row.rawData + "</textarea>" +
              htableize(_a) +
            "</div>";

        // second column

        str += "<div class=\"col-sm-4\">" +
              "<textarea cols='50' rows='10'>" + JSON.stringify(_c, null, "\t") + "</textarea>" +

              "<br>Format opts: <br><textarea cols='40' rows='6'>" + JSON.stringify(dataOpts, null, "\t") + "</textarea>" +

              "</div>";

        // third column
        str += "<div class=\"hs-chart col-sm-4\"></div>";
      str += "</div></section>";
      var $str = $(str);
      $table.append($str);
      $str.find(".hs-chart").highcharts(
        $.extend(true, {
           chart: {
              type: 'bar',
              width: 300,
              height: 300
           },
           credits: { enabled: false },
           title: { text: null },
           xAxis: { categories: true }
        }, { series: _c })

      );

    }




  });
})



function htableize(rows){
  var tstr = "<table class=\"table table-condensed table-bordered\">";
  tstr += $.map(rows, function(row){
    var s = "<tr>";
    s += $.map(row, function(c){ return "<td>" + c + "</td>"; }).join("");
    s += "</tr>";

    return s;
  }).join("");

  tstr += "</table>";

  return tstr;
}

// $(document).ready(function(){
//   $("#data-samples tbody tr").each(function(){
//     var $rawtd = $(this).find(".raw textarea");
//     var raw = $rawtd.text();
//     var parsedData = $.parse(raw, {header: false}).results;


//     /// show parsed as HTML table
//     var $parsed = $(this).find(".parsed");
//     var tstr = "<table class=\"table table-condensed\">";
//     tstr += $.map(parsedData, function(row){
//       var s = "<tr>";
//       s += $.map(row, function(c){ return "<td>" + c + "</td>"; }).join("");
//       s += "</tr>";

//       return s;
//     }).join("");

//     tstr += "</table>";

//     $parsed.html(tstr);

//     var opts = {
//       categories: $rawtd.attr('data-categories'),
//       seriesNamed: $rawtd.attr('data-seriesNamed'),
//       seriesFormat: $rawtd.attr('data-seriesFormat'),
//     }

//     // add opts Hash to the table for convenient viewing
//     $(this).find(".raw").append("<pre class='req'>" + JSON.stringify(opts, null, "\t") + "</pre>");

//     // show parsed as JSON
//     var pstr = tkparser(raw, opts);
//     $parsed.after("<td><pre>" + pstr + "</pre></td>");

//   });

// })






// function tkparser(rawstr, opts){
//   // get an array
//   var array = $.parse(rawstr, {header: false}).results;
//   // more steps to come


//   // determine series-layout
//   var seriesFormat = opts.seriesFormat || "row";


//   // determine if series has a name
//   // true by default
//   var seriesNamed = (opts.seriesNamed === 'false' || opts.seriesNamed === false) ? false : true;



//   // determine categories
//   var categories = null;
//   if(!_.isEmpty(opts.categories)){
//     // categorical data
//     if(opts.categories === 'header'){
//       // first row contains the data
//       categories = array.shift();
//     }
//   }


//   // by this time, all data has been transposed to row-based format
//   var parsedData = { series: [] };
//   _.each(array, function(row){
//     // configure the series object, which contains:
//     // :data (an array of Objects or values)
//     var rObj = {};

//     if(seriesNamed){ // first column is assumed to have the name
//       rObj.name = row.shift();
//     }


//     // if there is a category, every point is given a name
//     rObj.data = _.map(row, function(val, idx){
//       var point = { y: val }
//       if(categories){ point.name = categories[idx]; }
//       return point;
//     });



//     parsedData.series.push(rObj);
//   })


//   return JSON.stringify(parsedData, null, 4);
// }


