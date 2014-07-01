(function(){

  var Charty = window.Charty || {}
  var Data = Charty.Data = function(){
      var attributes = this.attributes = {};
      this.parser = new Charty.DataParser();

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

      this.categories = function(arr) {
        if (!arguments.length) return attributes.categories;
        attributes.categories = arr;
        return this;
      };

      this.hasCategories = function(){
        var c = this.categories();
        return (_.isArray(c) && !_.isEmpty(c));
      }

      this.seriesNameFormat = function(value) {
        if (!arguments.length) return attributes.seriesNameFormat;
        attributes.seriesNameFormat = value;
        return this;
      };

      this.parse = function(opts){
        var arrs = this.parser.parseRawCSV(this.rawData());
        var dataset = this.parser.arraysToFlatDataSet(arrs);
        opts = opts || {x: 'x', y: 'y', seriesKey: 'seriesKey'};

        return this.parser.toHighChartsFormat(dataset, opts);
      };

  };
})();

