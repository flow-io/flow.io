/**
*
*	STREAM: JSON parser
*
*
*
*	DESCRIPTION:
*		- 
*
*
*	API:
*		- 
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/05/11: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Module to stream JSON objects:
		JSONStream = require( 'JSONStream' );
		

	// STREAM //

	/**
	* FUNCTION: getParser()
	*	Returns a transform stream to parse a JSON stream.
	*
	* @returns {stream} JSON stream parser
	*/
	function getParser() {
		var stream = JSONStream.parse( '*' );
		stream.on( 'error', function onError( error ) {
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getParser()


	// EXPORTS //

	module.exports = getParser;

})();