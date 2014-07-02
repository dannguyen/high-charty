(function () {
  'use strict';
  describe('Charty.Chart', function(){

    it('is ok', function(){
      "a".should.equal('a')
    });

    describe('initialization by hash', function(){
      it("applies the attributes found in the hash", function(){

        var h = {xAxisTitle: 'hello chart'};
        var chart = new Charty.Chart(h);

        chart.xAxisTitle().should.equal('hello chart');

      });
    });


  });
})()
