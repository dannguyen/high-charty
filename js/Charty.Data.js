(function(){

  var Charty = window.Charty || {}
  var Data = Charty.Data = function(){
      var attributes = this.attributes = {};

      attributes.rawData = "";
      attributes.delimiter = ",";
      attributes.seriesNameFormat = "row"; // where the name of the series is located

      this.rawData = function(value) {
        if (!arguments.length) return attributes.rawData;
        attributes.rawData = value;
        return this;
      };

      this.delimiter = function(value) {
        if (!arguments.length) return attributes.delimiter;
        attributes.delimiter = value;
        return this;
      };


      this.seriesNameFormat = function(value) {
        if (!arguments.length) return attributes.seriesNameFormat;
        attributes.seriesNameFormat = value;
        return this;
      };

      // transpose rawData
      this.transpose = function(arr){
        return Object.keys(arr[0]).map(
          function (c) { return arr.map(function (r) { return r[c]; }); }
        );
      };

      this.parse = function(){
        var opts = { header: false };
        var arrs = $.parse(this.rawData(), opts).results;

        return _.reduce(arrs, function(memo, arr){
          var o = {name: arr[0], data: arr.slice(1)};
          memo.push(o);

          return memo;
        }, []);

      };

  };
})();

var testd = new Charty.Data();
