/**
*
*	STREAM: through array
*
*
*	DESCRIPTION:
*		- Creates a through stream from an input stream which emits a single array.
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
*		- 2014/06/14: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] through
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


	// FUNCTIONS //

	/**
	* FUNCTION: onData( data )
	*	Data event handler. Queues each array element.
	*
	* @private
	* @param {array} data - data array (NOTE: no data elements should be NULL!)
	*/
	function onData( data ) {
		for ( var i = 0; i < data.length; i++ ) {
			this.queue( data[ i ] );
		}
	} // end FUNCTION onData()

	/**
	* FUNCTION: onEnd()
	*	End event handler.
	*
	* @private
	*/
	function onEnd() {
		this.queue( null );
	} // end FUNCTION onEnd()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {stream} Stream instance
	*/
	function Stream() {
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: stream()
	*	Returns a through stream which takes an array and creates a readable stream.
	*
	* @returns {stream} through stream
	*/
	Stream.prototype.stream = function() {
		return through( onData, onEnd );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();