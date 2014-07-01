// Sample router
// from: https://github.com/flatiron/director

var author = function () { console.log("author"); };
      var books = function () { console.log("books"); };
      var viewBook = function (bookId) {
        console.log("viewBook: bookId is populated: " + bookId);
      };

      var routes = {
        '/author': author,
        '/author/:lastName/:firstName': function(lastName, firstName){
          console.log("This is the author page for: " + firstName + " " + lastName);
        },
        '/books': [books, function() {
          console.log("An inline route handler.");
        }],
        '/books/view/:bookId': viewBook
      };

      var router = Router(routes);

      router.init();
