$(document).ready(function() {

	$('#download-image-link a.prep').click(function(e) {
		var canvas = document.getElementById('canvas');

		$('#download-image-link a.prep').hide();
	    e.preventDefault();

	    var filename = 'untitled'; // TODO: set up useful filename structure based on chart contents, date
		var source = new Array();

		var element = $('.highcharts-container');
	    source.push(element.html());
		var canvasContext = canvas.getContext("2d");
		canvasContext.drawSvg(element.html(),0,0);

	    var url = window.URL.createObjectURL(new Blob(source, { "type" : "text\/xml" }));

	    $('#download-image-link a.download-svg').attr({
	    	href: url,
	    	download: filename + '.svg'
		}).show();
		$('#download-image-link a.download-png').attr({
			href: canvas.toDataURL('png'),
			download: filename + '.png'
		}).show();

	});

});
