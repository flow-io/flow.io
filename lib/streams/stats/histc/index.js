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

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream reduce:
		reducer = require( './../../json/reduce.js' ),

		// Module to determine bin location:
		getBin = require( './binarysearch.js' );


	// FUNCTIONS //

	/**
	* FUNCTION: linspace( min, max, increment )
	*	Generate a linearly spaced vector.
	*
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
	* @param {array} edges - 1d array defining the bins in which to tabulate data.
	* @returns {array} counts array (note: array length is edges.length+1 to include -/+ infinity bins, i.e., data outside of defined edge range, and each array element is a 3-element array: [ prev_edge | count | edge ] )
	*/
	function newCounts( edges ) {
		var numBins = edges.length + 1,
			counts = new Array( numBins );

		for ( var i = 0; i < numBins; i++ ) {
			counts[ i ] = [
				edges[ i-1 ],
				0,
				edges[ i ]
			];
		} // end FOR i
		return counts;
	} // end FUNCTION newCounts()

	/**
	* FUNCTION: stringify()
	*	Returns a transform function to stringify streamed data.
	*/
	function stringify() {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {array} data - streamed data
		* @returns {string} stringified data
		*/
		return function transform( data ) {
			return JSON.stringify( data );
		}; // end FUNCTION transform()
	} // end FUNCTION stringify()


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
		this._edges = vector;
		return this;
	}; // end METHOD edges()

	/**
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		var self = this;
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			return getBin( self._edges, data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: reduce()
	*	Returns a data reduction function to tabulate bin counts.
	*
	* @returns {function} data reduction function
	*/
	Stream.prototype.reduce = function() {
		/**
		* FUNCTION: reduce( acc, data )
		*	Defines the data reduction.
		*
		* @param {array} acc - accumulation array
		* @param {number} idx - streamed bin index
		* @returns {array} accumulation array
		*/
		return function reduce( counts, idx ) {
			counts[ idx ][ 1 ] += 1;
			return counts;
		};
	}; // end METHOD reduce()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, counts, rStream, sStream, pStream;

		// Create an input transform stream:
		iStream = transformer( this.transform() );

		// Initialize a new counts array:
		counts = newCounts( this._edges );

		// Create a reduction stream to tabulate data values:
		rStream = reducer( this.reduce(), counts );

		// Create a transform stream to stringify tabulated data:
		sStream = transformer( stringify() );

		// Create a stream pipeline:
		pStream = pipeline(
			iStream,
			rStream,
			sStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();