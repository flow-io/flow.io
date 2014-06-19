/**
*
*	STREAM: read
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
		fs = require( './../../utils/graceful-fs' );
		

	// STREAM //

	/**
	* FUNCTION: getReader( path, clbk )
	*	Returns a readable stream which reads from a file.
	*
	* @param {string} path - file path
	* @param {function} clbk - (optional) callback to invoke after finishing reading a file. Function should take one input argument: [ error ]. If no errors, error is null.
	* @returns {stream} readable stream
	*/
	function getReader( path, clbk ) {
		if ( !arguments.length ) {
			throw new Error( 'readStream()::insufficient input arguments. Must provide an input file path.' );
		}
		var stream = fs.createReadStream( path );
		stream.on( 'error', function onError( error ) {
			var err = {
					'status': 404,
					'message': 'Error encountered while attempting to read data. Ensure that the file path is valid.'
				};
			console.error( error.stack );
			if ( clbk ) {
				clbk( err );
			}
		});
		stream.on( 'close', function onEnd() {
			if ( clbk ) {
				clbk();
			}
		});
		return stream;
	} // end FUNCTION getReader()


	// EXPORTS //

	module.exports = getReader;

})();