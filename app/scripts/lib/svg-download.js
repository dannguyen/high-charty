// Can't implement the colorpicker without re-ordering requirejs's dependencies and how the app is actually loaded; delegate gets around this issue with the SVG/PNG events, since that requires a click anyway; no fix for colorPicker unless the same is done

$(document).ready(function() {

	// --------------------------------
	// Download actions
	// --------------------------------

	$('#the-content').delegate('#download-image-link a.prep', 'click', function(e) {
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

	// --------------------------------
	// Color picker
	// --------------------------------

	$('#the-content').delegate('#color-picker a.prep', 'click', function(e) {

		var pickerColors =
		['ffb900', 'ffdc80', 'e2a300', 'bf8900', '7f5b00',
		'3691ce', '5fb5ee', '2b74a5', '215a7f', '112d40',
		'48ce36', '70ee5f', '39a52b', '2c7f21', '164011',
		'ce3636', 'ee5f5f', 'a52b2b', '7f2121', '401111'];

		$('#download-image-link a.prep').hide();
		e.preventDefault();
		$('#color-picker .picker').show();
		$('#color-picker .picker #color1').colorPicker({pickerDefault: pickerColors[0], colors: pickerColors});

	});

	// picker.change(function() {
	// 	chart.series()[$(this).parent().data().index].color = $(this).val();
	// 	ChartBuilder.redraw();
	// });

});










