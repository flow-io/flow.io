/**
*
*	STREAM: reduce
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
*		- 2014/05/21: Created. [AReines].
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

	var // Through module:
		through = require( 'through' );


	// STREAM //

	/**
	* FUNCTION: getReducer( fcn, accumulator )
	*	Reduces a data stream to a single value.
	*
	* @param {function} fcn - function applied to reduce data. Function should take two arguments: [ accumulator, data ]. Function should return the accumulator.
	* @param {number} accumulator - initial accumulation value
	* @returns {stream} reducer stream
	*/
	function getReducer( fcn, accumulator ) {
		if ( arguments.length < 2 ) {
			throw new Error( 'reduce()::insufficient input arguments. Must provide both an accumulator function and an initial value.' );
		}
		return through( onData, onEnd );

		// FUNCTIONS //

		/**
		* FUNCTION: onData( data )
		*	Data event handler. Runs the accumulation function.
		*/
		function onData( data ) {
			accumulator = fcn( accumulator, data );
		} // end FUNCTION onData()

		/**
		* FUNCTION: onEnd()
		*	End event handler. Emits the accumulated value.
		*/
		function onEnd() {
			this.emit( 'data', accumulator );
			this.emit( 'end' );
		} // end FUNCTION onEnd()

	} // end FUNCTION getReducer()


	// EXPORTS //

	module.exports = getReducer;

})();