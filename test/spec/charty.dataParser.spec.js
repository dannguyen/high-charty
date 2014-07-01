/* global describe, it */

(function () {
    'use strict';
        describe('Charty.DataParser', function(){
          it('should exist', function(){
            assert.equal(_.isUndefined(Charty.DataParser), false);
          });

          var parser = new Charty.DataParser();

          describe('Charty.DataParser.parseRawCSV', function(){
            it("returns an Array", function(){
              var r = parser.parseRawCSV("");
              assert.equal(_.isArray(r), true);
            });

            it("returns an Array of Arrays for multiple lines", function(){
              var r = parser.parseRawCSV("a\nb\nc");
              assert.equal(r.length, 3);
              assert.equal(r[0][0], 'a');
            });

            it("delimits by comma by default", function(){
              var r = parser.parseRawCSV("a,b,c");
              assert.equal(r[0].length, 3);
              assert.equal(r[0][2], 'c');

              assert.deepEqual(r, [['a', 'b', 'c']])
            });
          });


          describe('Charty.DataParser.transposeArray', function(){
            it('turns rows into columns', function(){
              var arr = [[1,2,3], [4,5,6]];
              parser.transposeArray(arr).should.deep.equal( [[1,4],[2,5],[3,6]] );
            });

            it('turns cols into rows', function(){
              var arr = [[1,4],[2,5],[3,6]];
              parser.transposeArray(arr).should.deep.equal( [[1,2,3], [4,5,6]]);
            });
          });


          describe('Chart.DataParser.arraysToFlatDataSet', function(){
            var arr = [['x', 'y', 'series', 'category'],
                [10, 100, 'Apples', 'Winter'],
                [22, 200, 'Oranges', 'Winter']];

            it('maps values to first row of array', function(){
              var h = parser.arraysToFlatDataSet(arr)[1];

              h.should.deep.equal(
                {x: 22, y: 200, series: 'Oranges', category: 'Winter'});
            });
          });


          describe('Chart.DataParser.pickAndSwitchKeys', function(){
            var arr = [{a: 42, b: 60, c: 100}, {a: 7, b: 10, c: 99}]
            var newarr = parser.pickAndSwitchKeys(arr, {x: 'a', y: 'b'});

            it('renames and filters the keys', function(){
              newarr.should.deep.equal([{x: 42, y: 60}, {x: 7, y: 10 }]);
            });
          });


          describe('Chart.DataParser.groupByKey', function(){
            var arr = [
              { genre: 'fruit', name: 'apple', price: 2.50, quantity: 100 },
              { genre: 'animal', name: 'cat', price: 62.2, quantity: 42 },
              { genre: 'fruit', name: 'orange', price: 1.50, quantity: 99 }
            ];

            it('creates a new Hash of grouped by key objects', function(){
              var hsh = parser.groupByKey(arr, 'genre');

              hsh.should.deep.equal({
                  'fruit': [
                    { genre: 'fruit', name: 'apple', price: 2.50, quantity: 100 },
                    { genre: 'fruit', name: 'orange', price: 1.50, quantity: 99 }
                  ], 'animal': [
                    { genre: 'animal', name: 'cat', price: 62.2, quantity: 42 }
                  ]
                });
            });
          });


          describe('Chart.DataParser.toHighChartsFormat', function(){
            var arr = [
              { country: 'US', year: 1980, gdp: 500 },
              { country: 'US', year: 1990, gdp: 600 },
              { country: 'JP', year: 1980, gdp: 700 },
              { country: 'JP', year: 1990, gdp: 400 }
            ];

            it('conveniently returns a Highcharts-friendly object', function(){
              var seriesarr = parser.toHighChartsFormat( arr,
                { x: 'year', y: 'gdp', seriesKey: 'country'}
              )

              seriesarr.should.deep.equal(
                [
                  { name: 'US', data: [{x: 1980, y: 500}, {x: 1990, y: 600}] },
                  { name: 'JP', data: [{x: 1980, y: 700}, {x: 1990, y: 400}] },
                ]
              );
            });
          })
        });

})();
