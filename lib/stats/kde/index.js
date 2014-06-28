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

		// Map transform stream:
		mapStream = require( 'flow-map' ),

		// JSON stream stringify:
		stringifier = require( './../../json/stringify.js' ),

		// Module to calculate the KDE:
		KDE = require( './kde.js' );


	// FUNCTIONS //

	/**
	* FUNCTION: parse( data )
	*	Defines the data transformation.
	*
	* @private
	* @param {array} data - streamed data
	* @returns {string} parsed JSON data
	*/
	function parse( data ) {
		return JSON.parse( data );
	} // end FUNCTION parse()

	/**
	* FUNCTION: transform()
	*	Returns a data transformation function.
	*
	* @private
	* @returns {function} data transformation function
	*/
	function transform() {
		var kde = new KDE();
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @private
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			kde.estimator( data, 'silverman' );
			return kde.eval( data );
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
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, sStream, pStream, tStream, pipeline;

		// TODO: re-examine the need to stringify, wait, then parse. See median stream for alternative. Join(','), then parse.

		// Create an input transform stream: (require the data to be a single JSON chunk)
		iStream = stringifier();

		// Create a sink stream to buffer all transformed data into memory:
		sStream = eventStream.wait();

		// Create a map transform stream to parse the JSON data:
		pStream = mapStream()
			.map( parse )
			.stream();

		// Create a map transform stream to calculate the KDE:
		tStream = mapStream()
			.map( transform() )
			.stream();

		// Create a stream pipeline:
		pipeline = eventStream.pipeline(
			iStream,
			sStream,
			pStream,
			tStream
		);

		// Return the pipeline:
		return pipeline;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();