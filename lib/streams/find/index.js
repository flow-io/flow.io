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
	* FUNCTION: onData( accessors, filters )
	*	Returns a function which is applied to each datum in a data stream.
	*
	* @private
	* @param {object} accessors - function collection to access data to be filtered; e.g.; { 'x': function( d ){return d.x;}, 'y': function( d ){return d.y;} }.
	* @param {object} filters - function collection applied to filter data. Function output will be evaluated as true/false.
	* @returns {function} callback
	*/
	function onData( accessors, filters ) {
		var aKeys = Object.keys( accessors ),
			numAccessors = keys1.length,
			fKeys = Object.keys( filters ),
			numFilters = fKeys.length,
			accessor, value, filter;
		if ( numAccessors !== numFilters ) {
			throw new Error( 'find()::unable to initialize stream. Number of accessors (' + numAccessors + ') does not equal number of filters (' + numFilters + ').' );
		}
		for ( var i = 0; i < numAccessors; i++ ) {
			if ( !filters.hasOwnProperty( aKeys[ i ] ) ) {
				throw new Error( 'find()::unable to initialize stream. Accessor does not contain a corresponding filter: ' + aKeys[ i ] );
			}
		}
		/**
		* FUNCTION: onData( d )
		*	Data event handler. All data meeting the function condition are allowed to pass through. All data failing the condition are removed. Note: if a value cannot be accessed, no data is emitted.
		*
		* @param {*} d - data stream datum
		*/
		return function onData( d ) {
			for ( var i = 0; i < numAccessors; i++ ) {
				// Get the value...
				accessor = accessors[ aKeys[ i ] ];
				try {
					value = accessor( d );
				} catch ( err ) {
					return;
				}

				// Apply the filter:
				filter = filters[ aKeys[ i ] ];
				if ( !filter( value ) ) {
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

		// ACCESSORS //
		this._accessors = {};

		// FILTERS //
		this._filters = {};

		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: accessors( name, fcn )
	*	Value accessor setter and getter. If an accessor name and function are supplied, sets the value accessor. If no function is supplied, returns the value accessor. If neither a name or function are supplied, returns all accessors.
	*
	* @example Setting an accessor.
	* myStream.accessors( 'x', function(d){return d;});
	*
	* @param {string} name - accessor name
	* @param {function} fcn - value accessor
	* @returns {object|function|object} instance object, value accessor, or accessors
	*/
	Stream.prototype.accessors = function( name, fcn ) {
		var names = Object.keys( this._accessors ),
			accessors = {};

		if ( !arguments.length ) {
			for ( var i = 0; i < names.length; i++ ) {
				accessors[ names[ i ] ] = this._accessors[ names[ i ] ];
			}
			return accessors;
		}
		if ( arguments.length === 1 ) {
			return this._accessors[ name ];
		}
		this._accessors[ name ] = fcn;
		return this;
	}; // end METHOD accessors()

	/**
	* METHOD: filters( name, fcn )
	*	Filters setter and getter. If a filter name and function are supplied, sets the filter. If no function is supplied, returns the filter. If neither a name or function are supplied, returns all filters.
	*
	* @example Setting a filter.
	* myStream.filters( 'x', function(d){return (d%2) ? true : false;});
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
		this._filters[ name ] = fcn;
		return this;
	}; // end METHOD filters()

	/**
	* METHOD: stream()
	*	Returns a through stream for extracting data from an input data stream.
	*/
	Stream.prototype.stream = function() {
		return through( onData( this._accessors, this._filters ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();