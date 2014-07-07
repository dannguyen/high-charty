(function () {
  describe('BackCharty.Chart', function(){

    it('is ok', function(){
      "a".should.equal('a');
      _.isUndefined(BackCharty.Chart).should.equal(false);

      var x = new BackCharty.XAxis({title: 'xtitle'})
        x.get('title').should.equal('xtitle');


//      var d = new BackCharty.Data({rawData: 'some,data'});
    });

    describe('initialization by hash', function(){
      var h = {xAxisTitle: 'hello chart', height: 500};
      var chart = new BackCharty.Chart(h);

      it("applies the attributes found in the hash", function(){
        chart.get('xAxisTitle').should.equal('hello chart');
      });

      it("serializesFormatted", function(){
        var atts = chart.serializeFormattedAttributes();
        atts['xAxis']['title'].should.deep.equal({enabled: true, text: 'hello chart'});
      });

      it("serializesRaw", function(){
        var atts = chart.serializeRawAttributes();
        atts.xAxisTitle.should.equal('hello chart');
        _.isUndefined(atts.xAxis).should.equal(true);
      });
    });


    describe('delegation to BackCharty.Data', function(){
      var rtxt = [    "categoryKey,seriesKey,yKey",
                      "genre,year,gross",
                      "Horror,1990,5.4",
                      "Horror,2000,12.3",
                      "Action,1990,39.6",
                      "Action,2000,52.1"].join("\n");

      var chart = new BackCharty.Chart({rawData: rtxt});

      it("has parsed data series", function(){
        var d = new BackCharty.Data({rawData: rtxt});
        d.parseData()[0].data[0].should.deep.equal({"name": "Horror", "y": 5.4});

        var series = chart.serializeFormattedAttributes()['series'];
        series.should.deep.equal(d.parseData());
      })


    })


  });
})()
