/**
*
*	STREAM: kde
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

	var // Event-stream module:
		eventStream = require( 'event-stream' ),

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream stringify:
		stringifier = require( './../../json/stringify.js' ),

		// Module to calculate the KDE:
		KDE = require( './kde.js' );


	// FUNCTIONS //

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

	/**
	* FUNCTION: parse()
	*	Returns a transform function to parse JSON streamed data.
	*/
	function parse() {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {array} data - streamed data
		* @returns {string} parsed JSON data
		*/
		return function transform( data ) {
			return JSON.parse( data );
		}; // end FUNCTION transform()
	} // end FUNCTION parse()


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
		var kde = new KDE();
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			kde.estimator( data, 'silverman' );
			return kde.eval( data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, sStream, pStream, tStream, oStream, pipeline;

		// Create an input transform stream: (require the data to be a single JSON chunk)
		iStream = stringifier();

		// Create a sink stream to buffer all transformed data into memory:
		sStream = eventStream.wait();

		// Create a transform stream to parse the JSON data:
		pStream = transformer( parse() );

		// Create a transform stream to calculate the KDE:
		tStream = transformer( this.transform() );

		// Create a transform stream to stringify the output:
		oStream = transformer( stringify() );

		// Create a stream pipeline:
		pipeline = eventStream.pipeline(
			iStream,
			sStream,
			pStream,
			tStream,
			oStream
		);

		// Return the pipeline:
		return pipeline;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();