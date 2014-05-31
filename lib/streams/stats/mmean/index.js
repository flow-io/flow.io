/**
*
*	STREAM: moving mean
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
*		- 2014/05/27: Created. [AReines].
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


	// FUNCTIONS //

	/**
	* FUNCTION: getBuffer( W )
	*	Returns a buffer array where each element is pre-initialized to zero.
	*
	* @param {number} W - buffer size
	* @returns {array} buffer
	*/
	function getBuffer( W ) {
		var buffer = new Array( W );
		for ( var i = 0; i < W; i++ ) {
			buffer[ i ] = 0;
		}
		return buffer;
	} // end FUNCTION getBuffer()

	/**
	* FUNCTION: onData( W )
	*	Returns a callback which calculates a moving mean and is invoked upon receiving new data.
	*
	* @param {number} W - window size
	* @returns {function} callback
	*/
	function onData( W ) {
		var buffer = getBuffer( W ),
			full = false, oldVal,
			mean = 0, N = 0, delta = 0;

		/**
		* FUNCTION: onData( newVal )
		*	Data event handler. Calculates a moving mean.
		*/
		return function onData( newVal ) {
			// Fill the buffer:
			if ( !full ) {
				buffer[ N ] = newVal;

				N += 1;
				delta = newVal - mean;
				mean += delta / N;

				if ( N === W ) {
					full = true;
					this.queue( mean );
				}
				return;
			} // end IF (!full)

			// Update our buffer:
			oldVal = buffer.shift();
			buffer.push( newVal );

			// Calculate the moving mean:
			delta = newVal - oldVal;
			mean += delta / W;

			// Queue the mean value:
			this.queue( mean );
		}; // end FUNCTION onData()
	} // end FUNCTION onData()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		this._window = 5;
		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: window( value )
	*	Setter and getter for window size. If a value is provided, sets the window size. If no value is provided, returns the window size.
	*
	* @param {number} value - window size
	* @returns {object|number} instance object or window size
	*/
	Stream.prototype.window = function( value ) {
		if ( !arguments.length ) {
			return this._window;
		}
		this._window = value;
	}; // end METHOD window()

	/**
	* METHOD: stream()
	*	Returns a through stream for calculating the moving mean. Note that, when the stream ends, the resulting dataset will have N-Window+1 data points.
	*/
	Stream.prototype.stream = function() {
		return through( onData( this._window ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();