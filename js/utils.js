
function _debug () {
	try {
		//return;
		if( typeof(console) != "undefined" ) {
			console.log.apply(console, arguments);
		}
	} catch(err) {};
}

