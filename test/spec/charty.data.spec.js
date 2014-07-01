/* global describe, it */

(function () {
  'use strict';
  describe('Charty.Data', function(){

    it('should exist', function(){
      _.isUndefined(Charty.Data).should.equal(false);
    });


    describe('a meh end to end test', function(){
      var dataThing = new Charty.Data();
      var rtxt = ["genre,year,gross",
                      "Horror,1990,5.4",
                      "Horror,2000,12.3",
                      "Action,1990,39.6",
                      "Action,2000,52.1"].join("\n");

      dataThing.rawData(rtxt);
      var parsedData = dataThing.parse({seriesKey: 'genre', x: 'year', y: 'gross'});

      it("parse() into a HighChart series array", function(){
        parsedData[0].name.should.equal('Horror');
      });

    });


  });

})();
