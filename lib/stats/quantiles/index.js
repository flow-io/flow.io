/**
*
*	STREAM: quantiles
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

	var // Event stream module:
		eventStream = require( 'event-stream' ),

		// Map transform stream:
		mapStream = require( 'flow-map' );


	// FUNCTIONS //

	/**
	* FUNCTIONS: quantiles( vector, num )
	*	Computes quantiles for a 1d dataset array.
	*
	* @private
	* @param {array} vector - 1d array
	* @param {number} num - number of quantiles
	* @returns {array} quantiles
	*/
	function quantiles( vector, num ) {
		var numValues = vector.length,
			qValues = new Array( num+1 ),
			vec, id, value;

		// Create a copy of the input vector:
		vec = vector.slice();

		// Sort the input vector:
		vec.sort( function ( a, b ) {
			return a - b;
		});

		// 0th quantile is the min:
		qValues[ 0 ] = vec[ 0 ];

		// Max defines the quantile upper bound:
		qValues[ num ] = vec[ numValues-1 ];

		// Get the quantiles...
		for ( var i = 1; i < num; i++ ) {

			// Calculate the vector index marking the quantile:
			id = ( numValues * i / num ) - 1;

			// Is the index an integer?
			if ( id === parseInt( id, 10 ) ) {
				// Value is the average between the value at id and id+1:
				value = ( vec[ id ] + vec[ id+1 ] ) / 2.0;
			} else {
				// Round up to the next index:
				id = Math.ceil( id );
				value = vec[ id ];
			}
			qValues[ i ] = value;
		} // end FOR i
		return qValues;
	} // end FUNCTION quantiles()

	/**
	* FUNCTION: transform( numQuantiles )
	*	Returns a data transformation function.
	*
	* @private
	* @param {number} numQuantiles - number of quantiles to calculate
	* @returns {function} data transformation function
	*/
	function transform( numQuantiles ) {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @private
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			// Convert a comma delimited string into an array:
			data = JSON.parse( '[' + data + ']' );

			// Compute the quantiles:
			return quantiles( data, numQuantiles );
		};
	} // end FUNCTION transform()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default number of quantiles:
		this._quantiles = 4; // default is a quartile

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: quantiles( value )
	*	Number of quantiles setter and getter. If a value is supplied, sets the number of quantiles. If no value is supplied, returns the number of quantiles.
	*
	* @param {number} value - number of quantiles
	* @returns {object|number} instance object or number of quantiles
	*/
	Stream.prototype.quantiles = function ( value ) {
		if ( !arguments.length ) {
			return this._quantiles;
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'quantiles()::invalid input argument. Value must be numeric.' );
		}
		this._quantiles = value;
		return this;
	}; // end METHOD quantiles()

	/**
	* METHOD: stream()
	*	Returns a JSON data transformation stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var jStream, sStream, qStream, pStream;

		// Create a stream to comma-deliminate all incoming data values:
		jStream = eventStream.join( ',' );

		// Create a sink stream to buffer all data values into memory:
		sStream = eventStream.wait();

		// Create a transform stream to calculate the quantiles:
		qStream = mapStream()
			.map( transform( this._quantiles ) )
			.stream();

		// Create a stream pipeline:
		pStream = eventStream.pipeline(
			jStream,
			sStream,
			qStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();