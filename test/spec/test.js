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
            });
          });


          describe('Charty.DataParser.transposeArray', function(){
            it('turns rows into columns', function(){
              var arr = [[1,2,3], [4,5,6]];
              _.isEqual(parser.transposeArray(arr), [[1,4],[2,5],[3,6]])
                .should.equal(true);
            });

            it('turns cols into rows', function(){
              var arr = [[1,4],[2,5],[3,6]];
              _.isEqual(parser.transposeArray(arr), [[1,2,3], [4,5,6]])
                .should.equal(true);
            });
          });



        });

})();
