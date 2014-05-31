/**
*
*	STREAM: median
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

		// JSON stream transform:
		transformer = require( './../../json/transform.js' );


	// FUNCTIONS //

	/**
	* FUNCTIONS: median( vector )
	*	Computes the median value of a 1d dataset array.
	*
	* @param {array} vector - 1d array
	* @returns {number} median value
	*/
	function median( vector ) {
		var id, vec;

		// Create a copy of the input vector:
		vec = vector.slice();

		// Sort the input vector:
		vec.sort( function ( a, b ) {
			return a - b;
		});

		// Get the middle index:
		id = Math.floor( vec.length / 2 );

		if ( vec.length % 2 ) {
			// The number of elements is not evenly divisible by two, hence we have a middle index:
			return vec[ id ];
		}

		// Even number of elements, so must take the mean of the two middle values:
		return ( vec[ id-1 ] + vec[ id ] ) / 2.0;
	} // end FUNCTION median()


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
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			// Convert a comma delimited string into an array:
			data = JSON.parse( '[' + data + ']' );

			// Compute the median:
			return median( data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var jStream, sStream, mStream, pStream;

		// Create a stream to comma-deliminate all incoming data values:
		jStream = eventStream.join( ',' );

		// Create a sink stream to buffer all data values into memory:
		sStream = eventStream.wait();

		// Create a transform stream to calculate the median value:
		mStream = transformer( this.transform() );

		// Create a stream pipeline:
		pStream = eventStream.pipeline(
			jStream,
			sStream,
			mStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();