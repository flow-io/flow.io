/**
*
*	STREAM: histc
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
*		- 2014/05/17: Created. [AReines].
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

		// Module to determine bin location:
		getBin = require( 'binsearch' ),

		// Stream transform:
		transformer = require( './../../transform' ),

		// Stream reduce:
		reducer = require( 'flow-reduce' );


	// FUNCTIONS //

	/**
	* FUNCTION: linspace( min, max, increment )
	*	Generate a linearly spaced vector.
	*
	* @private
	* @param {number} min - min defines the vector lower bound
	* @param {number} max - max defines the vector upper bound
	* @param {number} increment - distance between successive vector elements
	* @returns {array} a 1-dimensional array
	*/
	function linspace( min, max, increment ) {
		var numElements, vec = [];

		numElements = Math.round( ( ( max - min ) / increment ) ) + 1;

		vec[ 0 ] = min;
		vec[ numElements - 1] = max;

		for ( var i = 1; i < numElements - 1; i++ ) {
			vec[ i ] = min + increment*i;
		}
		return vec;
	} // end FUNCTION linspace()

	/**
	* FUNCTION: newCounts( edges )
	*	Initializes a new histogram counts array.
	*
	* @private
	* @param {array} edges - 1d array defining the bins in which to tabulate data.
	* @returns {array} counts array (note: array length is edges.length+1 to include -/+ infinity bins, i.e., data outside of defined edge range, and each array element is a 3-element array: [ prev_edge | count | edge ] )
	*/
	function newCounts( edges ) {
		var numBins = edges.length + 1,
			counts = new Array( numBins );

		// The first bin is for all data which is less than the left-most edge:
		counts[ 0 ] = [
			Number.NEGATIVE_INFINITY,
			0,
			edges[ 0 ]
		];

		for ( var i = 1; i < numBins-1; i++ ) {
			counts[ i ] = [
				edges[ i-1 ],
				0,
				edges[ i ]
			];
		} // end FOR i

		// The last bin is for all data which is greater than the right-most edge:
		counts[ numBins-1 ] = [
			edges[ edges.length-1 ],
			0,
			Number.POSITIVE_INFINITY
		];

		return counts;
	} // end FUNCTION newCounts()

	/**
	* FUNCTION: transform( edges )
	*	Returns a data transformation function.
	*
	* @private
	* @param {array} edges - 1d array containing histogram bin edges
	* @returns {function} data transformation function
	*/
	function transform( edges ) {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			return getBin( edges, data );
		};
	} // end FUNCTION transform()

	/**
	* FUNCTION: reduce( acc, data )
	*	Defines the data reduction.
	*
	* @private
	* @param {array} acc - accumulation array
	* @param {number} idx - streamed bin index
	* @returns {array} accumulation array
	*/
	function reduce( counts, idx ) {
		counts[ idx+1 ][ 1 ] += 1;
		return counts;
	} // end FUNCTION reduce()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		this._edges = linspace( -0.01, 1.01, 0.02 );
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: edges( vector )
	*	Edges setter and getter. If a vector is supplied, sets edges. If no vector is supplied, returns the edges.
	*
	* @param {array} vector - edges
	* @returns {object|vector} instance object or edges
	*/
	Stream.prototype.edges = function ( vector ) {
		if ( !arguments.length ) {
			return this._edges;
		}
		if ( !Array.isArray( vector ) ) {
			throw new Error( 'edges()::invalid input argument. Edges must be an array.' );
		}
		this._edges = vector;
		return this;
	}; // end METHOD edges()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, counts, rStream, pStream;

		// Create an input transform stream:
		iStream = transformer( transform( this._edges ) );

		// Initialize a new counts array:
		counts = newCounts( this._edges );

		// Create a reduction stream to tabulate data values:
		rStream = reducer()
			.reduce( reduce )
			.acc( counts )
			.stream();

		// Create a stream pipeline:
		pStream = pipeline(
			iStream,
			rStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();