/**
*
*	STREAM: write
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

	var // Drop-in replacement for filesystem module:
		fs = require( './../../graceful-fs' );
		

	// STREAM //

	/**
	* FUNCTION: getWriter( dest, clbk )
	*	Returns a writable stream which outputs to a provided destination.
	*
	* @param {string} dest - output destination
	* @param {function} clbk - (optional) callback to invoke after finishing writing a stream. Function should take one input argument: [ error ]. If no errors, error is null.
	* @returns {stream} writable stream
	*/
	function getWriter( dest, clbk ) {
		if ( !arguments.length ) {
			throw new Error( 'getWriter()::insufficient input arguments. Must provide an output file destination.' );
		}
		var stream = fs.createWriteStream( dest );
		stream.on( 'error', function onError( error ) {
			var err = {
					'status': 500,
					'message': 'Error encountered while attempting to write data.'
				};
			console.error( error.stack );
			if ( clbk ) {
				clbk( err );
			}
		});
		stream.on( 'finish', function onEnd() {
			if ( clbk ) {
				clbk();
			}
		});
		return stream;
	} // end FUNCTION getWriter()


	// EXPORTS //

	module.exports = getWriter;

})();