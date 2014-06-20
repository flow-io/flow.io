/**
*
*	STREAM: max
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
*		- 2014/05/23: Created. [AReines].
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

	var // Stream reduce:
		reducer = require( './../../reduce' );


	// FUNCTIONS //

	/**
	* FUNCTION: reduce( max, data )
	*	Defines the data reduction.
	*
	* @private
	* @param {number} max - current max value
	* @param {number} data - numeric stream data
	* @returns {number} reduced data
	*/
	function reduce( max, x ) {
		if ( x > max ) {
			max = x;
		}
		return max;
	} // end FUNCTION reduce()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator value:
		this._value = Number.NEGATIVE_INFINITY;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: value( value )
	*	Setter and getter for initial value from which to begin reduction. If a value is provided, sets the initial max value. If no value is provided, returns the initial max value.
	*
	* @param {number} value - initial max value
	* @returns {object|number} instance object or initial value
	*/
	Stream.prototype.value = function( value ) {
		if ( !arguments.length ) {
			return this._value;
		}
		this._value = value;
		return this;
	}; // end METHOD value()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		// Get the reduction stream:
		return reducer( reduce, this._value );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();