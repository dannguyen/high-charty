$(document).ready(function() {

	$('#download-image-link a.prep').click(function(e) {

		$('#download-image-link a.prep').hide();
	    e.preventDefault();

	    var filename = 'untitled'; // TODO: set up useful filename structure based on chart contents, date
		var source = new Array();

		var element = $('.highcharts-container');
	    source.push(element.html());

	    var url = window.URL.createObjectURL(new Blob(source, { "type" : "text\/xml" }));

	    $('#download-image-link a.download-svg').attr({
	    	href: url,
	    	download: filename + '.svg'
		}).show();
		$('#download-image-link a.download-png').attr({
			// href: source.toDataURL('png'), use canvg for this
			download: filename + '.png'
		}).show();

	});

});