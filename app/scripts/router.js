
page('/user', function(){
  console.log('id ish console')
})

// var router = new Router();

// router.map(function(match) {
//   match("/charts/:id").to("showChart");
// });

// var myHandlers = {};
// myHandlers.showChart = {
//   setup: function(chart){
//     console.log("klsdjf HEY");
//   }
// };


// // Sample router
// // from: https://github.com/flatiron/director

//       // var books = function () { console.log("books"); };
//       // var viewBook = function (bookId) {
//       //   console.log("viewBook: bookId is populated: " + bookId);
//       // };

//       // var routes = {
//       //   // '/author': author,
//       //   // '/author/:lastName/:firstName': function(lastName, firstName){
//       //   //   console.log("This is the author page for: " + firstName + " " + lastName);
//       //   // },
//       //   // '/books': [books, function() {
//       //   //   console.log("An inline route handler.");
//       //   // }],
//       //   // '/books/view/:bookId': viewBook
//       // };


//       var routes = {
//         '/chart' : function(){

//           var params = this.params
//           console.log(params)

//           $("#the-content").html('<h1>Chart</h1>')
//             .append("<div id=\"chart-from-url\"></div>");

//           var chart = new Charty.Chart();
//           chart.rawData("yKey\nditto\n10\n20\n50\n30");
//           chart.draw("#chart-from-url");
//         }
//       }


//       var router = Router(routes);

//       router.init();
