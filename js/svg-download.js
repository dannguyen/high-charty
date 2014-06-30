createSVGContent: function(svg) {
		/*
			Copyright (c) 2013 The New York Times

			Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
			The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

			SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		*/

		//via https://github.com/NYTimes/svg-crowbar

		var prefix = {
			xmlns: "http://www.w3.org/2000/xmlns/",
			xlink: "http://www.w3.org/1999/xlink",
			svg: "http://www.w3.org/2000/svg"
		};

		var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';


		svg.setAttribute("version", "1.1");

		var defsEl = document.createElement("defs");
		svg.insertBefore(defsEl, svg.firstChild); //TODO   .insert("defs", ":first-child")

		var styleEl = document.createElement("style");
		defsEl.appendChild(styleEl);
		styleEl.setAttribute("type", "text/css");


		// removing attributes so they aren't doubled up
		svg.removeAttribute("xmlns");
		svg.removeAttribute("xlink");

		// These are needed for the svg
		if (!svg.hasAttributeNS(prefix.xmlns, "xmlns")) {
			svg.setAttributeNS(prefix.xmlns, "xmlns", prefix.svg);
		}

		if (!svg.hasAttributeNS(prefix.xmlns, "xmlns:xlink")) {
			svg.setAttributeNS(prefix.xmlns, "xmlns:xlink", prefix.xlink);
		}

		var source = (new XMLSerializer()).serializeToString(svg).replace('</style>', '<![CDATA[' + styles + ']]></style>');

		return {svg: svg, source: [doctype + source]};
	},
	setFavicon: function() {
		//set favicon to image of chart
		var favicanvas = document.getElementById("favicanvas");
		favicanvas.width = 64;
		favicanvas.height = 64;
		
		var faviCanvasContext = favicanvas.getContext("2d");
		faviCanvasContext.translate(favicanvas.width / 2, favicanvas.height / 2);
		
		var svg = $.trim(document.getElementById("chartContainer").innerHTML);
		faviCanvasContext.drawSvg(svg,-16,-8,32,32);
		
		var icon = favicanvas.toDataURL("png");
		$("#favicon").attr("href",icon);
		
		return icon;
	},
	redraw: function() {
		$(".seriesItemGroup").detach();
		var g = chart;
		var s;
		var picker;
		var typer;
		var axer;
		this.customLegendLocaion = false;
		var colIndex = g.seriesByType().line.length;
		var lineIndex = 0;
		var bargridIndex = 0;
		var scatterIndex = 0;
		var seriesContainer = $("#seriesItems");
		var isMultiAxis = false;
		var colors = g.colors();
		var i;
		
		for (i=0; i < g.series().length; i++) {
			s = g.series()[i];
			seriesItem = $('<div class="seriesItemGroup">\
				<label for="'+this.idSafe(s.name)+'_color">'+s.name+'</label>\
				<input id="'+this.idSafe(s.name)+'_color" name="'+this.idSafe(s.name)+'" type="text" />\
				<select class="typePicker" id="'+this.idSafe(s.name)+'_type">\
					<option '+(s.type=="line"?"selected":"")+' value="line">Line</option>\
					<option '+(s.type=="column"?"selected":"")+' value="column">Column</option>\
					<option '+(s.type=="bargrid"?"selected":"")+' '+(g.xAxis().type == "date"?"disabled":"")+' value="bargrid">Bar Grid</option>\
					<option '+(s.type=="scatter"?"selected":"")+' value="scatter">Scatter</option>\
				</select>\
				<input id="'+this.idSafe(s.name)+'_check" name="'+this.idSafe(s.name)+'_check" type="checkbox" />\
				<div class="clearfix"></div>\
			</div>');
			var color = s.color ? s.color.replace("#","") : colors[i].replace("#","");
			s.color = "#" + color;
			
			seriesContainer.append(seriesItem);
			picker = seriesItem.find("#"+this.idSafe(s.name)+"_color").colorPicker({pickerDefault: color, colors:this.allColors});
			typer = seriesItem.find("#"+this.idSafe(s.name)+"_type");
			axer = seriesItem.find("#"+this.idSafe(s.name)+"_check");
			
			if(g.series()[i].axis == 1) {
				axer.prop("checked",true);
				if(!g.yAxis()[1].color || !isMultiAxis) {
					g.yAxis()[1].color = picker.val();
				}
				isMultiAxis = true;
			}
			else {
				axer.prop("checked",false);
			}
												
			seriesItem.data("index",i);
			picker.change(function() {
				chart.series()[$(this).parent().data().index].color = $(this).val();
				ChartBuilder.redraw();
			});
			typer.change(function() {
				var val = $(this).val();
				var index = $(this).parent().data().index;
				chart.series()[index].type = val;
				if(val == "column") {
					//if you're making a column chart, force the yAxis to span 0
					var axis = chart.yAxis()[chart.series()[$(this).parent().data().index].axis];
					if(axis.domain[1] > 0) {
						axis.domain[0] = Math.min(axis.domain[0],0);
					}
					else {
						axis.domain[1] = 0;
					}
				}

				var hasBargrid = false;
				chart.setPadding();
				ChartBuilder.setChartArea();
				chart.setXScales()
					.resize();
				ChartBuilder.redraw();

			});
			
			axer.change(function() {
				var axis = $(this).is(':checked') ? 1 : 0;
				chart.series()[$(this).parent().data().index].axis = axis;
				
				if(!chart.yAxis()[axis]) {
					chart.yAxis()[axis] = {
						domain: [null, null],
						tickValues: null,
						prefix: {
							value: "",
							use: "top" //can be "top", "all", "positive", or "negative"
						},
						suffix: {
							value: "",
							use: "top"
						},
						ticks: 4,
						formatter: null,
						color: null
					};
				}
				
				var leftAxisIsUsed = false;
				for(var i = 0; i < chart.series().length; i++) {
					if(chart.series()[i].axis == 1) {
						leftAxisIsUsed = true;
					}
				}
				
				if(chart.yAxis().length > 1 && !leftAxisIsUsed)
				{
					chart.yAxis().pop();
				}
				
				chart.setYScales()
					.setYAxes()
					.setLineMakers();
				ChartBuilder.redraw();
			});
			
			chart.redraw();
			this.makeLegendAdjustable();
		}
		
		
		var yAxisObj = [];
		for (i = g.yAxis().length - 1; i >= 0; i--){
			var cur = g.yAxis()[i];
			yAxisObj[i] = {
				domain: cur.domain,
				tickValues: cur.tickValues,
				prefix: cur.prefix,
				suffix: cur.suffix,
				ticks: cur.ticks,
				formatter: cur.formatter
			};
		}
		
		var xAxisObj = {
			domain: g.xAxis().domain,
			prefix: g.xAxis().prefix,
			suffix: g.xAxis().suffix,
			type: g.xAxis().type,
			formatter: g.xAxis().formatter
		};
		
		if(isMultiAxis){
			$("#leftAxisControls").removeClass("hide");
		}
		else {
			$("#leftAxisControls").addClass("hide");
		}
		
		var state = {
			container: g.containerElement(),
			colors: g.colors(),
			title: g.title(),
			padding : g.padding(),
			xAxis: xAxisObj,
			yAxis: yAxisObj,
			series: g.series(),
			xAxisRef: g.xAxisRef(),
			sourceline: g.source(),
			creditline: g.credit()
		};
		
		//chart = g;
		ChartBuilder.updateInterface();
		ChartBuilder.inlineAllStyles();
	},
	updateInterface: function() {
		if(chart.xAxis().type == "date") {
			$(".showonlywith-date").removeClass("hide");
		}

		if(chart.xAxis().type == "ordinal") {
			$(".showonlywith-ordinal").removeClass("hide");
		}

		if(chart.xAxis().type != "date") {
			$(".showonlywith-date").addClass("hide");
		}

		if(chart.xAxis().type != "ordinal") {
			$(".showonlywith-ordinal").addClass("hide");
		}

		if(this.advancedMode) {
			$(".advanced").removeClass("hide");
		}
		else {
			$(".advanced").addClass("hide");
		}
	},
	setChartArea: function() {
		var hasBargrid = false;
		for (var i = chart.series().length - 1; i >= 0; i--){
			if(chart.series()[i].type == "bargrid") {
				hasBargrid = true;
				break;
			}
		}
		
		if(hasBargrid) {
			$("#chartContainer").css("height",
				chart.series()[0].data.length * (chart.bargridBarThickness() + 2) + //CHANGE - MAGIC NUMBER
				chart.padding().top +
				chart.padding().bottom
				);
		}
		else {
			$("#chartContainer").removeAttr("height").css("height","");
		}
	},
	makeLegendAdjustable: function() {
		
		var legendLabelDrag = d3.behavior.drag()
			.origin(Object)
			.on("dragstart",function(d){
				elem = d3.select(this);
				d3.select(elem[0][0].parentNode).selectAll("rect").style("display","none");
				if(!ChartBuilder.customLegendLocaion) {
					chart.legend(false);
					chart.redraw();
					ChartBuilder.inlineAllStyles();
					ChartBuilder.makeLegendAdjustable();
					ChartBuilder.customLegendLocaion = true;
				}
				
			})
			.on("drag", function(d){
				elem = d3.select(this);
				elem.attr("x", Number(elem.attr("x")) + d3.event.dx)
					.attr("y", Number(elem.attr("y")) + d3.event.dy);
					
				
		});
		d3.selectAll("text.legendLabel").call(legendLabelDrag);
		
		
	},
	getAllInputData: function() {
		var d = {}, $el;
		var elems = $("input, textarea, select:not(#previous_charts)").each(function() {
			$el = $(this);
			d[$el.attr("id")] = $el.val();
		});
		return d;
	},
	storeLocalChart: function(name) {
		try {
			var testassignment = localStorage["savedCharts"][0];
		}
		catch(e) {
			localStorage["savedCharts"] = JSON.stringify([]);
		}
		
		var allcharts = JSON.parse(localStorage["savedCharts"]);
		newChart = this.getAllInputData();
		newChart.name = name;
		allcharts.push(newChart);
		localStorage["savedCharts"] = JSON.stringify(allcharts);
	},
	getLocalCharts: function() {
		var charts = [];
		try {
			charts = JSON.parse(localStorage["savedCharts"]);
		}
		catch(e){ /* Fail Silently */}
		
		return charts;
	},
	loadLocalChart: function(d) {
		for (var key in d) {
			if(key != "name") {
				$("#"+key).val(d[key]);
				//$("#"+key).text(d[key])
			}
		}
		$("input, textarea, select:not(#previous_charts)").keyup().change();
	},
	idSafe: function(s) {
		s = s.replace(/[^\w\d]+/gi,"-");
		return s;
	},
	addCommas: function(nStr)
	{
		if(Number(nStr) + "" == nStr) {
			//if the string is a number return a localized string
			return Number(nStr).toLocaleString()
		}

		//else return the string
		return nStr
	},
	determineLocaleNumberSeps: function() {
		var n = 1000.50;
		var l = n.toLocaleString();
		return {decimal: l.substring(5,6), thousands: l.substring(1,2)};
	},
	actions: {
		axis_prefix_change: function(index,that) {
			chart.yAxis()[index].prefix.value = $(that).val();
			ChartBuilder.redraw();
			ChartBuilder.inlineAllStyles();
		},
		axis_suffix_change: function(index,that) {
			chart.yAxis()[index].suffix.value = $(that).val();
			ChartBuilder.redraw();
			ChartBuilder.inlineAllStyles();
		},
		axis_tick_num_change: function(index,that) {
			chart.yAxis()[index].ticks = parseInt($(that).val(),10);
			ChartBuilder.redraw();
			ChartBuilder.inlineAllStyles();
		},
		axis_max_change: function(index,that) {
			var val = parseFloat($(that).val());
			if(isNaN(val)) {
				val = null;
			}
			chart.yAxis()[index].domain[1] = val;
			ChartBuilder.redraw();
			ChartBuilder.inlineAllStyles();
		},
		axis_min_change: function(index,that) {
			var val = parseFloat($(that).val());
			if(isNaN(val)) {
				val = null;
			}
			chart.yAxis()[index].domain[0] = val;
			chart.setYScales();
			ChartBuilder.redraw();
			ChartBuilder.inlineAllStyles();
		},
		axis_tick_override_change: function(index,that) {
			var val = $(that).val();
			val = val.split(",");
			if(val.length > 1) {
				for (var i = val.length - 1; i >= 0; i--){
					val[i] = parseFloat(val[i]);
				}
			}
			else {
				val = null;
			}
			chart.yAxis()[index].tickValues = val;
			chart.setYScales();
			ChartBuilder.redraw();
			ChartBuilder.inlineAllStyles();
		}
	},
	showInvalidData: function() {
		$("#inputDataHeading").addClass("inputDataHInvData");
		$("#invalidDataSpan").removeClass("hide");
	},
	hideInvalidData: function() {
		$("#inputDataHeading").removeClass("inputDataHInvData");
		$("#invalidDataSpan").addClass("hide");
	}
};