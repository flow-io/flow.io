/**
*
*	STREAM: outliers
*
*
*
*	DESCRIPTION:
*		- Filters a data stream for outliers.
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
	* FUNCTION: sort( vector )
	*	Sorts a 1d data array.
	*
	* @private
	* @param {array} vector - 1d array
	* @returns {array} sorted 1d array (ascending)
	*/
	function sort( vector ) {
		// Create a copy of the input vector:
		var vec = vector.slice();
		// Sort the input vector:
		vec.sort( ascending );
		return vec;
	} // end FUNCTION sort()

	/** 
	* FUNCTION: ascending( a, b )
	*	Method to perform an ascending sort of numeric values.
	*
	* @private
	* @param {number} a - number
	* @param {number} b - number
	* @returns {number} difference between a and b
	*/
	function ascending( a, b ) {
		return a - b;
	} // end FUNCTION ascending()

	/**
	* FUNCTION: quartiles( vector )
	*	Computes quartiles for a 1d dataset array.
	*
	* @private
	* @param {array} vector - sorted (ascending) 1d array
	* @returns {array} quartiles as a 2-element array
	*/
	function quartiles( vector ) {
		var qValues = new Array( 2 );

		qValues[ 0 ] = quantile( vector, 0.25 );
		qValues[ 1 ] = quantile( vector, 0.75 );
		
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

	/**
	* FUNCTION: stringify()
	*	Returns a transform function to stringify streamed data.
	*
	* @private
	* @returns {function} transform function
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
		this._index = false;
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: index( bool )
	*	Setter and getter for index flag, which specifies whether or not to retain an outlier's index. If a value is provided, sets the index flag. If no value is provided, returns the index flag.
	*
	* @param {boolean} bool - index flag
	* @returns {object|boolean} instance object or index flag
	*/
	Stream.prototype.index = function( bool ) {
		if ( !arguments.length ) {
			return this._index;
		}
		this._index = bool;
	}; // end METHOD index()

	/**
	* METHOD: filter()
	*	Returns a data filter function.
	*
	* @returns {function} data filter function
	*/
	Stream.prototype.filter = function() {
		var FLG = this._index;
		/**
		* FUNCTION: filter( data )
		*	Defines the data filter.
		*
		* @param {number} data - numeric stream data
		* @returns {number} filtered data
		*/
		return function filter( data ) {
			var qValues, iqr,
				bounds = new Array( 2 ),
				idx, d, outliers = [];

			// Convert a comma delimited string into an array:
			data = JSON.parse( '[' + data + ']' );

			// Sort the data:
			data = sort( data );

			// Compute the quartiles:
			qValues = quartiles( data );

			// Compute the inter-quartile range:
			iqr = qValues[ 1 ] - qValues[ 0 ];

			// Compute the outlier bounds:
			bounds[ 0 ] = qValues[ 0 ] - ( 1.5*iqr );
			bounds[ 1 ] = qValues[ 1 ] + ( 1.5*iqr );

			// Find the values less than the lower bound:
			idx = 0;
			while ( data[ idx ] < bounds[ 0 ] ) {
				if ( FLG ) {
					d = [ idx, data[idx] ];
				} else {
					d = data[ idx ];
				}
				outliers.push( d );
				idx += 1;
			}

			// Find the values greater than the upper bound:
			idx = data.length - 1;
			while ( data[ idx ] > bounds[ 1 ] ) {
				if ( FLG ) {
					d = [ idx, data[idx] ];
				} else {
					d = data[ idx ];
				}
				outliers.push( d );
				idx = idx - 1;
			}

			// Return the outliers:
			return outliers;
		};
	}; // end METHOD filter()

	/**
	* METHOD: stream()
	*	Returns a JSON data filter stream.
	*/
	Stream.prototype.stream = function() {
		var jStream, wStream, oStream, sStream, pStream;

		// Create a stream to comma-deliminate all incoming data values:
		jStream = eventStream.join( ',' );

		// Create a sink stream to buffer all data values into memory:
		wStream = eventStream.wait();

		// Create a transform stream to filter for outliers:
		oStream = transformer( this.filter() );

		// Create a transform stream to stringify the results:
		sStream = transformer( stringify() );

		// Create a stream pipeline:
		pStream = eventStream.pipeline(
			jStream,
			wStream,
			oStream,
			sStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();