/**
*
*	STREAM: transform
*
*
*
*	DESCRIPTION:
*		- Encloses an event stream in a closure, where a user-defined function maps (transforms) each received datum to a new value.
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

	var // Module allowing for event data transformation:
		eventStream = require( 'event-stream' );
		

	// STREAM //

	/**
	* FUNCTION: getTransformer( func, clbk )
	*	Provided a data transformation function, returns an event stream which applies the transformation to piped data.
	*
	* @param {function} func - data transformation function
	* @param {function} clbk - (optional) callback to invoke in the event of an error.
	* @returns {stream} transform stream
	*/
	function getTransformer( func, clbk ) {
		if ( !arguments.length ) {
			throw new Error( 'getTransformer()::insufficient input arguments. Must provide a transformation function.' );
		}
		var stream = eventStream.map( function onData( data, callback ) {
			callback( null, func( data ) );
		});
		stream.on( 'error', function onError( error ) {
			if ( clbk ) {
				clbk( error );
				return;
			}
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getTransformer()


	// EXPORTS //

	module.exports = getTransformer;

})();