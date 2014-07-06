(function () {
  describe('BackCharty.Chart', function(){

    it('is ok', function(){
      "a".should.equal('a')
    });

    describe('initialization by hash', function(){
      var h = {xAxisTitle: 'hello chart'};
      var chart = new BackCharty.Chart(h);

      it("applies the attributes found in the hash", function(){
        chart.get('xAxisTitle').should.equal('hello chart');
      });

      it("serializesFormatted", function(){
        var atts = chart.serializeFormattedAttributes();
        atts['xAxis'].should.deep.equal( { title: {enabled: true, text: 'hello chart' }});
      });

      it("serializesRaw", function(){
        var atts = chart.serializeRawAttributes();
        atts.xAxisTitle.should.equal('hello chart');
      });

    });


  });
})()
