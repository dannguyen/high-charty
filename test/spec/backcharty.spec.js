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
          },
          childFruit: {
            component: this.constructor
          }
        }
      });

      var xc = new XComponent({apples: 20, oranges: 5});

      describe("getFormattedValue()", function(){
        it("uses the defined .value function", function(){
          xc.get('apples').should.equal( 20 );
          xc.getFormattedValue('apples').should.equal("20 bushels.")
        });

        it("returns get(key) by default", function(){
          xc.get('oranges').should.equal( 5 );
          xc.getFormattedValue('oranges').should.equal(5);
        });
      });

      describe("getFormattedObject()", function(){
        it("uses the defined .object function", function(){
          xc.getFormattedObject('apples').should.deep.equal( {fruits: {apples: "20 bushels." }}  );
          xc.getFormattedObject('oranges').should.deep.equal( {fruits: {oranges: 5 }}  );
        });
      });


      describe("serializeFormattedAttributes()", function(){
        it("returns a Hash from registeredChartyAttributes", function(){
          xc.serializeFormattedAttributes().should.deep.equal(
            { fruits: { apples: "20 bushels.", oranges: 5}}
          );
        });
      });


      describe("children components", function(){
        var childComp = new XComponent({oranges: 42});
        var parentComp = new XComponent({oranges: 99, childFruit: childComp});

        it('recursively serializes', function(){
          childComp.serializeFormattedAttributes().should.deep.equal({fruits: {oranges: 42}});

          parentComp.serializeFormattedAttributes().should.deep.equal({
                      fruits: {
                        oranges: 99
                      },
                      childFruit: {
                        fruits: {oranges: 42 }
                      }
          });

        });
      });


    });
  });





})()
