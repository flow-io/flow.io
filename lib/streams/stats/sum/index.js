/**
*
*	STREAM: sum
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

	var // JSON stream reducer:
		reducer = require( './../../json/reduce.js' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator value:
		this._value = 0;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: value( value )
	*	Setter and getter for initial value from which to begin accumulation. If a value is provided, sets the initial accumulator value. If no value is provided, returns the initial accumulator value.
	*
	* @param {number} value - initial value
	* @returns {object|number} instance object or initial value
	*/
	Stream.prototype.value = function( value ) {
		if ( !arguments.length ) {
			return this._value;
		}
		this._value = value;
	}; // end METHOD value()

	/**
	* METHOD: reduce()
	*	Returns a data reduction function.
	*
	* @returns {function} data reduction function
	*/
	Stream.prototype.reduce = function() {
		/**
		* FUNCTION: reduce( sum, data )
		*	Defines the data reduction.
		*
		* @param {number} sum - current value
		* @param {number} data - numeric stream data
		* @returns {number} reduced data
		*/
		return function reduce( sum, x ) {
			sum += x;
			return sum;
		};
	}; // end METHOD reduce()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		// Get the reduction stream:
		return reducer( this.reduce(), this._value );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();