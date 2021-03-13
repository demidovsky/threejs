$(document).ready(function() {
	var files = require.context('../img/sprite/', false, /\.svg$/);
	files.keys().forEach(files);
	// console.log( files.keys() );
});