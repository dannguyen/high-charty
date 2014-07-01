(function(){

  var Charty = window.Charty || {}
  var DataParser = Charty.DataParser = function(){

  };


  // returns an Array
  DataParser.prototype.parseRawCSV = function(rawcsv){
    return $.parse(rawcsv, { header: false }).results;
  }

  DataParser.prototype.transposeArray = function(arr){
    return Object.keys(arr[0]).map(
      function (c) { return arr.map(function (r) { return r[c]; }); }
    );
  }

  // {arr} is an Array of Arrays in which the first row
  // contains the headers/attributes
  //
  //   arr = [['x', 'y'], [0, 0], [2, 5]]
  //
  // return: An Array of Hashes
  //  [{x: 0, y: 0}, {x: 2, y: 5}]

  DataParser.prototype.arraysToFlatDataSet = function(arr){
    var headers = arr[0];

    return _.map( arr.slice(1), function(row){
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
    var keyMap = _.omit(dataOpts, 'seriesKey')
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
})();
