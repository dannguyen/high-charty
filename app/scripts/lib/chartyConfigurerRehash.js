window.ChartyConfigurer.packager = {};
window.ChartyConfigurer.packager.config = {};

window.ChartyConfigurer.packager.config.axis = {
  categorical: function(value){
    return { categories: true };
  }
};

window.ChartyConfigurer.packager.config.chart = {
  stacking: function(value){
    var v = (value === 'stacked') ? 'normal' : null;

    return { root: true, pkg: { plotOptions: { series: { stacking: v } } }};
  },

  width: function(value){
    var v = (value === '100%') ? null : value;
    var obj = { width: v };
    return { attributes: obj };
  }
};


window.ChartyConfigurer.packager.config.data = {

  colors: function(value){
    var v = _.isArray(value) ? value : (value + '').split(',');

    return v;
    ,
    text: function(value){
      var v =  fooparsedData(v)
      return { root: true, pkg: { series: v }  }
    }

}


    data: {

    },
  }






  }



  data: {
    required: true,
    value: function(val, self){
      var d = self.dataObject();
      return d.serializeFormattedAttributes();
    },

    object: function(parsedData){
      return({ series: parsedData });
    },

  },

  xAxis: {
    required: true,
    value: function(val, self){
      var dobj = self.dataObject();
      if(dobj.hasCategories()){
        var charttype = Axis.Categorical;
      }else{
        var charttype = Axis.Standard;
      }
      var c = new charttype({title: self.get('xAxisTitle') });

      return c.serializeFormattedAttributes();
    },
    object: function(val, self){
      var axisObj = { xAxis: val };
      return axisObj;
    }
  },

  yAxis: {
    required: true,
    value: function(val, self){
      var c = new Axis.Standard({
        title: self.get('yAxisTitle') }
      );
      return c.serializeFormattedAttributes();
    },
    object: function(val){
      return( { yAxis: val });
    }
  },



  colors: {
    object: function(val){ return({ colors: val })},
    value: function(val){
      // assume it to be either an Array or a comma-delimited string
      return _.isArray(val) ? val : (val + '').split(',');
    }
  },

  height: {
    object: function(val){ return({ chart: { height: val } }); }
  },
  width: {
    object: function(val){ return({ chart: { width: val } }); },
    value: function(val){return val === '100%' ? null : val; }
  },
  chartType: {
    object: function(val){ return({ chart: { type: val } }); }
  },
  stackType: {
    object: function(val){ return({ plotOptions: { series: {stacking: val} } }); },
    value: function(val){
      if(val === 'stacked'){ return 'normal'; }
      else{ return null; }
    }
  }


}
