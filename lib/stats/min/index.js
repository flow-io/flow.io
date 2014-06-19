/**
*
*	STREAM: min
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


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator value:
		this._value = Number.POSITIVE_INFINITY;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: value( value )
	*	Setter and getter for initial value from which to begin reduction. If a value is provided, sets the initial min value. If no value is provided, returns the initial min value.
	*
	* @param {number} value - initial min value
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
	* METHOD: _reduce()
	*	Returns a data reduction function.
	*
	* @returns {function} data reduction function
	*/
	Stream.prototype._reduce = function() {
		/**
		* FUNCTION: reduce( min, data )
		*	Defines the data reduction.
		*
		* @param {number} min - current min value
		* @param {number} data - numeric stream data
		* @returns {number} reduced data
		*/
		return function reduce( min, x ) {
			if ( x < min ) {
				min = x;
			}
			return min;
		};
	}; // end METHOD _reduce()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		// Get the reduction stream:
		return reducer( this._reduce(), this._value );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();