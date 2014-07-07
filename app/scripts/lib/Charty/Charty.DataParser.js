define(
  ['underscore', 'backbone', 'jquery', 'jquery_parse'],
  function(_, Backbone, $){

  var DataParser = function(){

  };


  // returns an Array of Arrays
  DataParser.prototype.parseRawCSV = function(rawcsv){
    return $.parse(rawcsv, { header: false }).results;
  }


  DataParser.prototype.transposeArray = function(arr){
    return Object.keys(arr[0]).map(
      function (c) { return arr.map(function (r) { return r[c]; }); }
    );
  }


  // {arrs} is an Array of Arrays
  // {headers} is the ostensible headers row for {arrs}
  //   in which the first row contains the headers/attributes
  //
  //   arrs = [[0, 0], [2, 5]]
  //   headers = ['x', 'y']
  //
  // return: An Array of Hashes
  //  [{x: 0, y: 0}, {x: 2, y: 5}]
  DataParser.prototype.arraysToFlatDataSet = function(arrs, headers){
    return _.map( arrs, function(row){
      return _.object(headers, row);
    });
  }

  // {arr} is assumed to be a FlatDataSet-like array:
  //
  //    arr = [{a: 0, b: 0, c: 999}, {a: 2, b: 5}]
  //
  // {hmap} is a Hash of key-value pairs, in which the key
  //   is the :key to keep, and the :value is the new alias
  //   for the current :key. Any keys not in arr's objects will
  //   be dropped
  //
  //    hmap = { a: 'x', b: 'y'};
  //
  // returns: An Array of Hashes
  //
  //    [{x: 0, y: 0}, {x: 2, y: 5}]

  DataParser.prototype.pickAndSwitchKeys = function(arr, hmap){
    return _.map(arr, function(obj){
      return _.reduce(hmap, function(memo, oldKey, newKey){
        memo[newKey] = obj[oldKey];

        return memo
      }, {});
    })
  };

  // given a FlatDataSet {arr} and a string {key}
  // returns: a Hash in which the keys are the groupBy {key}
  //  and the values are the array of Hashes with the same {key}
  DataParser.prototype.groupByKey = function(arr, key){
    return _.groupBy(arr, key);
  }

  // given a FlatDataSet as {arr}, and an {dataOpts} Hash like:
  // {seriesKey: 'genre', x: 'a', y: 'b'}
  // returns an Array
  // [{ name: 'Horror', data: [{x: 2, y: 3}] }, {name: 'Romance', data: []}]
  DataParser.prototype.toHighChartsFormat = function(orgArr, dataOpts){
    var self = this;
//   because HighCharts 3.0 API specifies :name as the
//    key for what we think of as :category

    var keyMap = {x: dataOpts.xKey, y: dataOpts.yKey, z: dataOpts.zKey, name: dataOpts.categoryKey}

    keyMap = _.reduce(keyMap, function(memo, v, k){
      if(!_.isUndefined(v)){
        memo[k] = v;
      }
      return memo;
    }, {});



    var sKey = dataOpts.seriesKey || 'seriesKey'; // use seriesKey as a header by default
    var groupedArr = self.groupByKey(orgArr, dataOpts.seriesKey);

    // ugh inefficient to loop again
    return _.reduce(groupedArr, function(memoArr, dArr, seriesName){
      var seriesObj = { name: seriesName };
      seriesObj.data = self.pickAndSwitchKeys(dArr, keyMap);
      memoArr.push(seriesObj);

      return memoArr
    }, []);

  }



    return DataParser;
  }
);
