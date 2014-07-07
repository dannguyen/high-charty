define(
  ['underscore', 'backbone', 'jquery', 'chartyComponent', 'chartyDataParser'],
  function(_, Backbone, $, Component, DataParser){


  var Data = Component.extend({
    initialize: function(){
      this.parser = new DataParser();

      this.on('change:rawData', function(model, data){
        console.log('rawData changed');
        this._parseData();
      });

      this._parseData();
    },

    defaults: {
      rawData: ""
    },

    hasCategories: function(){
      var catkey = this.get("categoryKey");
      return !(_.isUndefined(catkey) || _.isEmpty(catkey));
    },

    // overridding this
    serializeFormattedAttributes: function(){
      return this.exportForChart();
    },

    mapHeaderOpts: function(hMap, hdrs){
      var self = this;
      if(_.isEmpty(hMap) || _.isEmpty(hdrs)){
        var z = {};
      }else{
        var z = _.object(_.zip(hMap, hdrs));
      }

      _.each(['xKey', 'yKey', 'zKey', 'categoryKey', 'seriesKey'], function(k){
        var v = z[k];
//        console.log("Setting " + k + " to: " + v);
        self.set(k,v);
      });

      return z;
    },

    _parseData: function(){
      var arrs = this.parser.parseRawCSV(this.get('rawData'));
      var headersMap = arrs[0];
      var headers = arrs[1];
      var nonheader_data = arrs.slice(2);

      if(_.isEmpty(nonheader_data) || _.isEmpty(headers)){
        this.dataset = []
      }else{
        this.dataset = this.parser.arraysToFlatDataSet(nonheader_data, headers);
      }

      this.headerOpts = this.mapHeaderOpts(headersMap, headers);
    },



    exportForChart: function(){
      return this.parser.toHighChartsFormat(this.dataset, this.headerOpts);
    }

  });


  return Data;


});
