
(function(){
   window.Charty = window.Charty || {};



  window.Charty.Data = Charty.Component.extend({
    initialize: function(){
      this.parser = new Charty.DataParser();
    },

    defaults: {
      rawData: ""
    },

    // overridding this
    serializeFormattedAttributes: function(){
      return this.parseData();
    },

    mapOpts: function(hMap, hdrs){
      var self = this;
      var z = _.object(_.zip(hMap, hdrs));
      // _.each(z, function(v, k){
      //   self.set(k,v);
      // });

      return z;
    },

    parseData: function(){
      var arrs = this.parser.parseRawCSV(this.get('rawData'));
      if(_.isEmpty(arrs)){ return []; }

      var headersMap = arrs[0];
      var headers = arrs[1];

      var nonheader_data = arrs.slice(2);
      var dataset = this.parser.arraysToFlatDataSet(nonheader_data, headers);
      var opts = this.mapOpts(headersMap, headers);

      return this.parser.toHighChartsFormat(dataset, opts);
    }
  });




})();
