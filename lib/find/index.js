/**
*
*	STREAM: find
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
*		- 2014/06/17: Created. [AReines].
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

	var // Through module:
		through = require( 'through' );


	// FUNCTIONS //

	/**
	* FUNCTION: onData( filter )
	*	Returns a function which is applied to each datum in a data stream.
	*
	* @private
	* @param {object} filter - function applied to filter data. Function output will be evaluated as true/false.
	* @returns {function} callback
	*/
	function onData( filter ) {
		/**
		* FUNCTION: onData( d )
		*	Data event handler. All data meeting filter conditions are allowed to pass through.
		*
		* @param {*} d - data stream datum
		*/
		return function onData( d ) {
			try {
				if ( !filter( d ) ) {
					return;
				}
			} catch ( err ) {
				return;
			}
			// Data passed the filter...
			this.queue( d );
		}; // end FUNCTION onData()
	} // end FUNCTION onData()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @constructor
	* @returns {object} Stream instance
	*/
	function Stream() {
		this._filter = null;
		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: filter( fcn )
	*	Filter setter and getter. If a filter function is supplied, sets the filter. If no function is supplied, returns the filter.
	*
	* @example Setting a filter.
	* myStream.filter( function(d){return (d%2) ? true : false;});
	*
	* @param {function} fcn - filter function
	* @returns {object|function} instance object, filter
	*/
	Stream.prototype.filter = function( fcn ) {
		if ( !arguments.length ) {
			return this._filter;
		}
		if ( typeof fcn !== 'function' ) {
			throw new Error( 'filter()::invalid input argument. Filter must be a function.' );
		}
		this._filter = fcn;
		return this;
	}; // end METHOD filter()

	/**
	* METHOD: stream()
	*	Returns a through stream for extracting data from an input data stream.
	*/
	Stream.prototype.stream = function() {
		if ( !this._filter ) {
			throw new Error( 'stream()::stream not initialized. Must first provide a filter before creating a stream.' );
		}
		return through( onData( this._filter ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();