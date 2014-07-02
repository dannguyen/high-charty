(function(){

  var Charty = window.Charty || {}
  var Data = Charty.Data = function(){
      var attributes = this.attributes = {};
      this.parser = new Charty.DataParser();

      attributes.rawData = "";
      attributes.delimiter = ",";

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

      this.hasCategories = function() {
        return !(_.isUndefined(this.categoryKey()));
      };

      this.xKey = function(val) {
       if (!arguments.length) return attributes.xKey;
        attributes.xKey = val;
        return this;
      };

      this.yKey = function(val) {
       if (!arguments.length) return attributes.yKey;
        attributes.yKey = val;
        return this;
      };


      this.zKey = function(val) {
       if (!arguments.length) return attributes.zKey;
        attributes.zKey = val;
        return this;
      };

      this.categoryKey = function(val) {
       if (!arguments.length) return attributes.categoryKey;
        attributes.categoryKey = val;
        return this;
      };


      this.seriesKey = function(val) {
       if (!arguments.length) return attributes.seriesKey;
        attributes.seriesKey = val;
        return this;
      };





//////////////

      this.mapOpts = function(hMap, hdrs){
        var self = this;
        var z = _.object(_.zip(hMap, hdrs));
        _.each(z, function(v, k){
          self[k](v);
        })
        return z;
      }

      this.parse = function(opts){
        var arrs = this.parser.parseRawCSV(this.rawData());
        // watch out, this modifies arrs, and this._Key() attributes
        var headersMap = arrs.shift();
        var headers = arrs.shift();


        var dataset = this.parser.arraysToFlatDataSet(arrs, headers);
        // TK this should probably not be passed in, there's no need
        // to overrie it outside of what's done in parseRawCSV

        opts = this.mapOpts(headersMap, headers);

        return this.parser.toHighChartsFormat(dataset, opts);
      };

  };
})();

