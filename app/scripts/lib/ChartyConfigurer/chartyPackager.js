// TO DO:
// grab the flattenedAttributes from the structure
// THEN process them one by one


define(
  ['underscore', 'backbone', 'jquery', 'jquery_parse'],
  function(_, Backbone, $){

    var ChartyPackager = (function(){
      var o = {

        convert: function(atts){
          var config = this.config;
          var convertedAtts = _.inject(atts, function(memo, attVal, attName){
            var mash = {};
            var attFoo = config[attName];
            console.log(attName)
            if(_.isUndefined(attFoo)){
              // return a conventional hash
              var z = attName.split('_');
              var _h = {};
              _h[z[1]] = attVal;
              mash[z[0]] = _h; // e.g. {chart: {something: someVal }}
            }else{
              console.log('attfoo')
              console.log(attFoo);
              mash = attFoo(attVal);
            }

            return $.extend(true, memo, mash);
          }, {});

          return convertedAtts;
        },


        wrapComponentsInJson: function(canonAttributes){
          var obj = this.convert(canonAttributes)

          return JSON.stringify(obj, null, 4);
        }
      };


      o.dataPackage = function(txt){
        var foo = this.dataFoo;
        var t = foo.parseRawText(txt);
        t = foo.objectifyTextArrays(t);
        t = foo.parseForPackaging(t)

        return t;
      };

      o.dataFoo = (function(){
          return {
              parseRawText: function(text){
                return $.parse(text, { header: false }).results;
              },

              objectifyTextArrays: function(arrs){
                var metaHeaders = arrs[0], headers = arrs[1], xdata = arrs.slice(2);
                return {
                  headersMap: _.object(metaHeaders, headers),
                  data: _.map( xdata, function(row){
                    return _.object(headers, row);
                  })
                }
              },

              createKeyMap: function(metaheaders){
                var keyMap = {x: metaheaders.xKey, y: metaheaders.yKey, name: metaheaders.categoryKey};
                keyMap = _.reduce(keyMap, function(memo, v, k){
                  if(!_.isUndefined(v)){
                    memo[k] = v;
                  }
                  return memo;
                }, {});

                return keyMap;
              },

              groupByKey: function(arr, key){
                return _.groupBy(arr, key);
              },

              pickAndSwitchKeys: function(arr, hmap){
                return _.map(arr, function(obj){
                  return _.reduce(hmap, function(memo, oldKey, newKey){
                    memo[newKey] = obj[oldKey];

                    return memo
                  }, {});
                })
              },

              parseForPackaging: function(obj){
                var self = this;

                var headersMap = obj.headersMap;
                var keyMap = this.createKeyMap(headersMap);
                var sKey = headersMap.seriesKey
                var groupedArr = self.groupByKey(obj.data, sKey);

                return _.reduce(groupedArr, function(memoArr, dataArr, seriesName){
                  var seriesObj = { name: seriesName };
                  seriesObj.data = self.pickAndSwitchKeys(dataArr, keyMap);
                  memoArr.push(seriesObj);

                  return memoArr
                }, []);
              }
            };


          })();

      o.config = (function(packager){
        var _c = {


          xAxis_categorical: function(value){
            return { xAxis: { categories: true } };
          },

          chart_stacking: function(value){
            var v = (value === 'stacked') ? 'normal' : null;
            return  { plotOptions: { series: { stacking: v } } };
          },

          chart_width: function(value){
            var v = (value === '100%') ? null : value;
            var obj = { width: v };
            return obj;
          },

          data_seriesColors: function(value){
            var v = _.isArray(value) ? value : (value + '').split(',');
            return  {chart: { colors: v }};
          },

          data_text: function(value){
            console.log('what is this')
            console.log(this)

            var v =  packager.dataPackage(value);
            return  { series: v } ;
          }
        };

        return _c;
      }(o));


      return ({
        convert: o.convert,
        config: o.config,
        dataFoo: o.dataFoo,
        dataPackage: o.dataPackage,
        wrapComponentsInJson: o.wrapComponentsInJson
      });

    })();


    return ChartyPackager;
  }
);



      // o.config.axis = {
      //   categorical: function(value){
      //     return { categories: true };
      //   }
      // };

      // o.config.chart = {
      //   stacking: function(value){
      //     var v = (value === 'stacked') ? 'normal' : null;
      //     return { root: true, pkg: { plotOptions: { series: { stacking: v } } }};
      //   },

      //   width: function(value){
      //     var v = (value === '100%') ? null : value;
      //     var obj = { width: v };
      //     return obj;
      //   }
      // };


      // o.config.data = {
      //   seriesColors: function(value){
      //     var v = _.isArray(value) ? value : (value + '').split(',');
      //     return { root: true, pkg: {chart: { colors: v }}};
      //   },

      //   text: function(value){
      //     var v =  [value + "ASDFOD Ddoo"];
      //     return { root: true, pkg: { series: v }  }
      //   }
      // };
