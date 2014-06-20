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
	* FUNCTION: onData( filters )
	*	Returns a function which is applied to each datum in a data stream.
	*
	* @private
	* @param {object} filters - function collection applied to filter data. Function output will be evaluated as true/false.
	* @returns {function} callback
	*/
	function onData( filters ) {
		var keys = Object.keys( filters ),
			numFilters = keys.length,
			filter, key;
		/**
		* FUNCTION: onData( d )
		*	Data event handler. All data meeting filter conditions are allowed to pass through. All data failing any filter condition are removed. Note: if a value cannot be accessed, no data is emitted.
		*
		* @param {*} d - data stream datum
		*/
		return function onData( d ) {
			for ( var i = 0; i < numFilters; i++ ) {
				key = keys[ i ];

				// Apply the filter:
				filter = filters[ key ];
				if ( !filter( d ) ) {
					return;
				}
			}
			// Data passed all filter conditions:
			this.queue( d );
		}; // end FUNCTION onData()
	} // end FUNCTION onData()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// FILTERS //
		this._filters = {};

		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: filters( name, fcn )
	*	Filters setter and getter. If a filter name and function are supplied, sets the filter. If no function is supplied, returns the filter. If neither a name or function are supplied, returns all filters.
	*
	* @example Setting a filter.
	* myStream.filters( 'd', function(d){return (d%2) ? true : false;});
	*
	* @param {string} name - filter name
	* @param {function} fcn - filter function
	* @returns {object|function|object} instance object, filter, or filters
	*/
	Stream.prototype.filters = function( name, fcn ) {
		var names = Object.keys( this._filters ),
			filters = {};

		if ( !arguments.length ) {
			for ( var i = 0; i < names.length; i++ ) {
				filters[ names[ i ] ] = this._filters[ names[ i ] ];
			}
			return filters;
		}
		if ( arguments.length === 1 ) {
			return this._filters[ name ];
		}
		if ( typeof fcn !== 'function' ) {
			throw new Error( 'accessors()::invalid input argument. Second argument must be a function.' );
		}
		this._filters[ name ] = fcn;
		return this;
	}; // end METHOD filters()

	/**
	* METHOD: stream()
	*	Returns a through stream for extracting data from an input data stream.
	*/
	Stream.prototype.stream = function() {
		return through( onData( this._filters ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();