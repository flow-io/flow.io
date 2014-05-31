/**
*
*	STREAM: JSON stringify
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
	* FUNCTION: getStringifier()
	*	Returns a transform stream to stringify data as a JSON array.
	* 
	* @returns {stream} JSON stream stringifier
	*/
	function getStringifier() {
		var stream = JSONStream.stringify( '[\n\t', ',\n\t', '\n]\n' );
		stream.on( 'error', function onError( error ) {
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getStringifier()


	// EXPORTS //

	module.exports = getStringifier;

})();