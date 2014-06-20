/**
*
*	STREAM: skewness
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

	var // Stream-combiner:
		pipeline = require( 'stream-combiner' ),

		// Stream transform:
		transformer = require( './../../transform' ),

		// Stream reduce:
		reducer = require( './../../reduce' );


	// FUNCTIONS //

	/**
	* FUNCTION: reduce()
	*	Returns a data reduction function.
	*
	* @private
	* @returns {function} data reduction function
	*/
	function reduce() {
		var delta = 0,
			delta_n = 0,
			term1 = 0;
		/**
		* FUNCTION: reduce( acc, data )
		*	Defines the data reduction.
		*
		* @private
		* @param {object} acc - accumulation object containing the following properties: N, mean, M1, M2, M3. 'N' is the observatio number. 'mean' is the mean accumulator. 'M1' is the difference accumulator. 'M2' is the sum of squared difference accumulator. 'M3' is the cubed difference accumulator.
		* @param {number} data - numeric stream data
		* @returns {object} accumulation object
		*/
		return function reduce( acc, x ) {
			acc.N += 1;

			delta = x - acc.mean;
			delta_n = delta / acc.N;
			
			term1 = delta * delta_n * (acc.N-1);

			acc.M3 += term1*delta_n*(acc.N-2) - 3*delta_n*acc.M2;
			acc.M2 += term1;
			acc.M1 += delta;
			acc.mean += delta_n;

			return acc;
		};
	} // end FUNCTION reduce()

	/**
	* FUNCTION: transform( data )
	*	Defines the data transformation.
	*
	* @private
	* @param {object} data - stream data
	* @returns {value} transformed data
	*/
	function transform( data ) {
		return Math.sqrt( data.N )*data.M3 / Math.pow( data.M2, 3/2 );
	} // end FUNCTION transform()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator values:
		this._values = [ 0, 0, 0 ];
		this._mean = 0;
		this._N = 0;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: values( seeds )
	*	Setter and getter for initial values from which to begin accumulation. If a value array is provided, sets the initial values. If no array is provided, returns the initial values.
	*
	* @param {array} seeds - 3-element array with the following differences raised to powers: [ M1, M2, M3 ]. E.g., M1 = x-mu; M2 = (x-mu)^2; M3 = (x-mu)^3.
	* @returns {object|array} instance object or initial values
	*/
	Stream.prototype.values = function( values ) {
		var arr;
		if ( !arguments.length ) {
			// Return a copy:
			values = this._values;
			arr = new Array( values.length );
			for ( var i = 0; i < values; i++ ) {
				arr[ i ] = values[ i ];
			}
			return arr;
		}
		if ( !Array.isArray( value ) ) {
			throw new Error( 'value()::invalid input argument. Argument must an array.' );
		}
		if ( values.length !== 3 ) {
			throw new Error( 'values()::invalid input argument. Input argument must be a 3-element array.' );
		}
		this._values = values;
		return this;
	}; // end METHOD values()

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
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'mean()::invalid input argument. Mean must be numeric.' );
		}
		this._mean = value;
		return this;
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
		return this;
	}; // end METHOD numValues()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var rStream, pStream;

		// Get the reduction stream:
		rStream = reducer( reduce(),  {
			'N': this._N,
			'mean': this._mean,
			'M1': this._values[ 0 ],
			'M2': this._values[ 1 ],
			'M3': this._values[ 2 ]
		});

		pStream = pipeline(
			rStream,
			transformer( transform )
		);

		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();