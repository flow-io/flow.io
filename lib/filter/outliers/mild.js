/**
*
*	STREAM: mild outliers
*
*
*
*	DESCRIPTION:
*		- Filters a data stream for mild outliers.
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

		// Map transform stream:
		mapStream = require( 'flow-map' );


	// FUNCTIONS //

	/**
	* FUNCTION: sort( vector )
	*	Sorts a data vector.
	*
	* @private
	* @param {array} vector - data 1d array
	* @returns {array} sorted array (ascending)
	*/
	function sort( vector ) {
		// Indexify the vector...
		var dat = new Array( vector.length );
		for ( var i = 0; i < vector.length; i++ ) {
			dat[ i ] = [ i, vector[i] ];
		}
		// Sort the data array:
		dat.sort( ascending );
		return dat;
	} // end FUNCTION sort()

	/** 
	* FUNCTION: ascending( a, b )
	*	Method to perform an ascending sort of numeric values.
	*
	* @private
	* @param {array} a - [index, number]
	* @param {array} b - [index, number]
	* @returns {number} difference between a and b
	*/
	function ascending( a, b ) {
		return a[1] - b[1];
	} // end FUNCTION ascending()

	/**
	* FUNCTION: quartiles( data )
	*	Computes quartiles for a dataset array.
	*
	* @private
	* @param {array} data - sorted (ascending) array
	* @returns {array} quartiles as a 2-element array
	*/
	function quartiles( data ) {
		var qValues = new Array( 2 ),
			vector;

		vector = new Array( data.length );
		for ( var i = 0; i < data.length; i++ ) {
			vector[ i ] = data[ i ][ 1 ];
		}

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
	* FUNCTION: filter( FLG )
	*	Returns a data filter function.
	*
	* @private
	* @param {boolean} FLG - flag indicating whether to retain outlier index
	* @returns {function} data filter function
	*/
	function filter( FLG ) {
		/**
		* FUNCTION: filter( data )
		*	Defines the data filter.
		*
		* @param {number} data - numeric stream data
		* @returns {number} filtered data
		*/
		return function filter( data ) {
			var qValues, iqr,
				bounds = new Array( 4 ),
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
			bounds[ 0 ] = qValues[ 0 ] - ( 3.0*iqr );
			bounds[ 1 ] = qValues[ 0 ] - ( 1.5*iqr );
			bounds[ 2 ] = qValues[ 1 ] + ( 1.5*iqr );
			bounds[ 3 ] = qValues[ 1 ] + ( 3.0*iqr );

			// Find the values less than the mild lower bound but greater than the extreme lower bound:
			idx = 0;
			d = data[ idx ][ 1 ];
			while ( d < bounds[ 1 ] ) {
				if ( d > bounds[ 0 ] ) {
					outliers.push( ( FLG ) ? data[idx] : d );
				}
				idx += 1;
				d = data[ idx][ 1 ];
			}

			// Find the values greater than the mild upper bound but less than the extreme upper bound:
			idx = data.length - 1;
			d = data[ idx ][ 1 ];
			while ( d > bounds[ 2 ] ) {
				if ( d < bounds[ 3 ] ) {
					outliers.push( ( FLG ) ? data[idx] : d );
				}
				idx = idx - 1;
				d = data[ idx ][ 1 ];
			}

			// Return the outliers:
			return outliers;
		}; // end FUNCTION filter()
	} // end FUNCTION filter()


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
		return this;
	}; // end METHOD index()

	/**
	* METHOD: stream()
	*	Returns a JSON data filter stream.
	*/
	Stream.prototype.stream = function() {
		var jStream, wStream, oStream, pStream;

		// Create a stream to comma-deliminate all incoming data values:
		jStream = eventStream.join( ',' );

		// Create a sink stream to buffer all data values into memory:
		wStream = eventStream.wait();

		// Create a map transform stream to filter for mild outliers:
		oStream = mapStream()
			.map( filter( this._index ) )
			.stream();

		// Create a stream pipeline:
		pStream = eventStream.pipeline(
			jStream,
			wStream,
			oStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();