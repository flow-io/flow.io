/**
*
*	STREAM: inter-quartile range
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
*		- 2014/06/13: Created. [AReines].
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

		// Stream transform:
		transformer = require( './../../transform' );


	// FUNCTIONS //

	/**
	* FUNCTION: transform( data )
	*	Defines the data transformation.
	*
	* @private
	* @param {number} data - numeric stream data
	* @returns {number} transformed data
	*/
	function transform( data ) {
		var qValues;

		// Convert a comma delimited string into an array:
		data = JSON.parse( '[' + data + ']' );

		// Compute the quartiles:
		qValues = quartiles( data );

		// Return the interquartile range:
		return qValues[1] - qValues[0];
	} // end METHOD transform()

	/**
	* FUNCTION: quartiles( vector )
	*	Computes quartiles for a 1d dataset array.
	*
	* @private
	* @param {array} vector - 1d array
	* @returns {array} quartiles as a 2-element array
	*/
	function quartiles( vector ) {
		var qValues = new Array( 2 ),
			vec;

		// Create a copy of the input vector:
		vec = vector.slice();

		// Sort the input vector:
		vec.sort( function ( a, b ) {
			return a - b;
		});

		qValues[ 0 ] = quantile( vec, 0.25 );
		qValues[ 1 ] = quantile( vec, 0.75 );
		
		return qValues;
	} // end FUNCTION quantiles()

	/**
	* FUNCTION: quantile( vector, percent )
	*	Finds a quantile value.
	*
	* @private
	* @param {array} vector - 1d array
	* @param {number} percent - quantile percent [0,1]
	* @returns {number} quantile value
	*/
	function quantile( vector, percent ) {
		var numValues = vector.length,
			id, value;

		// Calculate the vector index marking the quantile:
		id = ( numValues * percent ) - 1;

		// Is the index an integer?
		if ( id === parseInt( id, 10 ) ) {
			// Value is the average between the value at id and id+1:
			value = ( vector[ id ] + vector[ id+1 ] ) / 2.0;
		} else {
			// Round up to the next index:
			id = Math.ceil( id );
			value = vector[ id ];
		}
		return value;
	} // end FUNCTION quantile()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		return this;
	} // end FUNCTION stream()

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

		// Create a transform stream to calculate the quartiles and interquartile range:
		qStream = transformer( transform );

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