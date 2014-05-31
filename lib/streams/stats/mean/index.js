/**
*
*	STREAM: mean
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

	var // Module to combine streams:
		pipeline = require( 'stream-combiner' ),

		// JSON stream reducer:
		reducer = require( './../../json/reduce.js' ),

		// JSON stream transformer:
		transformer = require( './../../json/transform.js' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator values:
		this._value = 0;
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
		* @param {object} acc - accumulation object containing two properties: N, mean. 'N' is the observation number accumulator and 'mean' is the mean accumulator.
		* @param {number} data - numeric stream data
		* @returns {object} accumulation object
		*/
		return function reduce( acc, x ) {
			acc.N += 1;
			delta = x - acc.mean;
			acc.mean += delta / acc.N;
			return acc;
		};
	}; // end METHOD reduce()

	/**
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			return data.mean;
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var rStream, tStream, pStream;

		// Create a reduction stream:
		rStream = reducer( this.reduce(), {
			'mean': this._value,
			'N': this._N
		});

		// Create a transform stream to extact the mean value:
		tStream = transformer( this.transform() );

		// Create a stream pipeline:
		pStream = pipeline(
			rStream,
			tStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();