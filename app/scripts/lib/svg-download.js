$(document).ready(function() {

	// --------------------------------
	// Download actions
	// --------------------------------

	$('#the-content').delegate('#download-image-link a.prep', 'click', function(e) {
		console.log('what the fuck');
		var canvas = document.getElementById('canvas');

		$('#download-image-link a.prep').hide();
		e.preventDefault();

		var filename = 'untitled'; // TODO: set up useful filename structure based on chart contents, date
		var source = [];

		// Grab the chart from this container, put in array
		var element = $('.highcharts-container');
		source.push(element.html());

		// Prep canvas and draw SVG in it
		var canvasContext = canvas.getContext('2d');
		canvasContext.drawSvg(element.html(),0,0);

		// Create new blob with SVG in it
		var url = window.URL.createObjectURL(new Blob(source, { 'type' : 'text\/xml' }));

		// Set up download links for blob and PNG from canvas; probably not supported cross-browser
		$('#download-image-link a.download-svg').attr({
			href: url,
			download: filename + '.svg'
		}).show();
		$('#download-image-link a.download-png').attr({
			href: canvas.toDataURL('png'),
			download: filename + '.png'
		}).show();
	});

	// $('#download-image-link a.prep').click(function(e) {
	// 	console.log('what the fuck');
	// 	var canvas = document.getElementById('canvas');

	// 	$('#download-image-link a.prep').hide();
	// 	e.preventDefault();

	// 	var filename = 'untitled'; // TODO: set up useful filename structure based on chart contents, date
	// 	var source = [];

	// 	// Grab the chart from this container, put in array
	// 	var element = $('.highcharts-container');
	// 	source.push(element.html());

	// 	// Prep canvas and draw SVG in it
	// 	var canvasContext = canvas.getContext('2d');
	// 	canvasContext.drawSvg(element.html(),0,0);

	// 	// Create new blob with SVG in it
	// 	var url = window.URL.createObjectURL(new Blob(source, { 'type' : 'text\/xml' }));

	// 	// Set up download links for blob and PNG from canvas; probably not supported cross-browser
	// 	$('#download-image-link a.download-svg').attr({
	// 		href: url,
	// 		download: filename + '.svg'
	// 	}).show();
	// 	$('#download-image-link a.download-png').attr({
	// 		href: canvas.toDataURL('png'),
	// 		download: filename + '.png'
	// 	}).show();

	// });

	// --------------------------------
	// URL parsing
	// --------------------------------

	// function getQueryParameter(name) {
	//     name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	//     var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	//         results = regex.exec(location.search);
	//     return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	// }

	// var queryHeight = getQueryParameter();
	// var queryWidth = getQueryParameter();
	// var queryChartType = getQueryParameter();
	// var queryStackType = getQueryParameter();
	// var queryXAxisTitle = getQueryParameter();
	// var queryYAxisTitle = getQueryParameter();
	// var queryYAxisTickPixelInterval = getQueryParameter();

	// --------------------------------
	// Color picker
	// --------------------------------

	var pickerColors =
	['ffb900', 'ffdc80', 'e2a300', 'bf8900', '7f5b00',
	'3691ce', '5fb5ee', '2b74a5', '215a7f', '112d40',
	'48ce36', '70ee5f', '39a52b', '2c7f21', '164011',
	'ce3636', 'ee5f5f', 'a52b2b', '7f2121', '401111'];

	// picker = seriesItem.find("#"+this.idSafe(s.name)+"_color").colorPicker({pickerDefault: color, colors:this.allColors});

	// picker.change(function() {
	// 	chart.series()[$(this).parent().data().index].color = $(this).val();
	// 	ChartBuilder.redraw();
	// });





});























