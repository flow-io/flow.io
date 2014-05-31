/**
*
*	STREAM: variance
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
*		- 2014/05/22: Created. [AReines].
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

	var // Stream-combiner:
		pipeline = require( 'stream-combiner' ),

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream reducer:
		reducer = require( './../../json/reduce.js' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator values:
		this._value = 0; // sum of squared differences!
		this._mean = 0;
		this._N = 0;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: value( value )
	*	Setter and getter for initial value from which to begin accumulation. If a value is provided, sets the initial accumulation value. If no value is provided, returns the accumulation value.
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
	* METHOD: mean( value )
	*	Setter and getter for initial mean value used during accumulation. If a value is provided, sets the initial mean value. If no value is provided, returns the mean value.
	*
	* @param {number} value - initial mean value
	* @returns {object|number} instance object or initial value
	*/
	Stream.prototype.mean = function( value ) {
		if ( !arguments.length ) {
			return this._mean;
		}
		this._mean = value;
	}; // end METHOD mean()

	/**
	* METHOD: numValues( value )
	*	Setter and getter for the total number of values the initial value for accumulation represents. If a value is provided, sets the number of values. If no value is provided, returns the number of values.
	*
	* @param {number} value - initial value number
	* @returns {object|number} instance object or initial value number
	*/
	Stream.prototype.numValues = function( value ) {
		if ( !arguments.length ) {
			return this._N;
		}
		this._N = value;
	}; // end METHOD numValues()

	/**
	* METHOD: reduce()
	*	Returns a data reduction function.
	*
	* @returns {function} data reduction function
	*/
	Stream.prototype.reduce = function() {
		var delta = 0;
		/**
		* FUNCTION: reduce( acc, data )
		*	Defines the data reduction.
		*
		* @param {object} acc - accumulation object containing three properties: N, mean, sos. 'N' is the observation number accumulator; 'mean' is the mean accumulator; 'sos' is the sum of squared differences accumulator
		* @param {number} data - numeric stream data
		* @returns {object} accumulation object
		*/
		return function reduce( acc, x ) {
			// SOS = Sum of Squared Differences
			acc.N += 1;
			delta = x - acc.mean;
			acc.mean += delta / acc.N;
			acc.sos += delta * ( x-acc.mean );
			return acc;
		};
	}; // end METHOD reduce()

	/**
	* METHOD: transform()
	*	Returns a data transformation function to calculate the unbiased sample variance from a sum of squares.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - stream data
		* @returns {value} transformed data
		*/
		return function transform( data ) {
			return data.sos / (data.N-1);
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var rStream, pStream;

		// Get the reduction stream:
		rStream = reducer( this.reduce(), {
			'N': this._N,
			'mean': this._mean,
			'sos': this._value
		});

		// Create a stream pipeline:
		pStream = pipeline(
			rStream,
			transformer( this.transform() )
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();