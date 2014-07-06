(function () {
  describe('BackCharty.Component', function(){

    it('is ok', function(){
      _.isUndefined(BackCharty.Component).should.equal(false)
    });

    describe('initialization by hash', function(){
      it("applies the attributes found in the hash", function(){
        var h = { someAtt: 'hello' };
        var chart = new BackCharty.Component(h);
        chart.get('someAtt').should.equal('hello');
      });
    });


    describe('registered attributes', function(){
      var XComponent = BackCharty.Component.extend({
        registeredChartyAttributes: {
          apples: {
            value: function(v){ return v + " bushels." },
            object: function(v){ return {fruits: { apples: v}}   }
          },
          oranges: {
            object: function(v){ return {fruits: { oranges: v}}   }
          }
        }
      });

      var xc = new XComponent({apples: 20, oranges: 5});

      describe("getExportedValue()", function(){
        it("uses the defined .value function", function(){
          xc.get('apples').should.equal( 20 );
          xc.getExportedValue('apples').should.equal("20 bushels.")
        });

        it("returns get(key) by default", function(){
          xc.get('oranges').should.equal( 5 );
          xc.getExportedValue('oranges').should.equal(5);
        });
      });

      describe("getExportedObject()", function(){
        it("uses the defined .object function", function(){
          xc.getExportedObject('apples').should.deep.equal( {fruits: {apples: "20 bushels." }}  );
          xc.getExportedObject('oranges').should.deep.equal( {fruits: {oranges: 5 }}  );
        });
      });


      describe("exportToHash()", function(){
        it("returns a Hash from registeredChartyAttributes", function(){
          xc.exportToHash().should.deep.equal(
            { fruits: { apples: "20 bushels.", oranges: 5}}
          );
        });

      });


    });
  });





})()
