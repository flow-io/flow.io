/**
*
*	STREAM: NaN
*
*
*
*	DESCRIPTION:
*		- Removes NaNs from a data stream. Only numeric data is allowed through.
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
*		- 2014/06/16: Created. [AReines].
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
	* FUNCTION: onData( accessors )
	*	Returns a callback which removes NaNs from a data stream and is invoked upon receiving new data.
	*
	* @private
	* @param {object} accessors - function collection to access data to be filtered; e.g.; { 'x': function( d ){return d.x;}, 'y': function( d ){return d.y;} } only emits data where both 'x' and 'y' are numeric.
	* @returns {function} callback
	*/
	function onData( accessors ) {
		var keys = Object.keys( accessors ),
			numKeys = keys.length,
			accessor, value;
		/**
		* FUNCTION: onData( d )
		*	Data event handler. Only emits data where accessed data is numeric. If a value cannot be accessed, no data is emitted. Note: if no set accessors, all data is allowed through.
		*
		* @param {*} d - data stream datum
		*/
		return function onData( d ) {
			for ( var i = 0; i < numKeys; i++ ) {
				accessor = accessors[ keys[i] ];
				try {
					value = accessor( d );
				} catch( err ) {
					return;
				}
				if ( !isNumber( value ) ) {
					return;
				}
			}
			// Queue the data:
			this.queue( d );
		}; // end FUNCTION onData()
	} // end FUNCTION onData()

	/**
	* FUNCTION: isNumber( value )
	*	Validates that a value is numeric.
	*
	* @private
	* @param {object|array|number|...} value - value to validate
	* @returns {boolean} boolean indicating whether a value is numeric.
	*/
	function isNumber( value ) {
		// Note: typeof NaN = 'number' && NaN != NaN.
		return ( typeof value === 'number' && value === value );
	} // end FUNCTION isNumber()


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
		if ( typeof fcn !== 'function' ) {
			throw new Error( 'accessors()::invalid input argument. Second argument must be a function.' );
		}
		this._accessors[ name ] = fcn;
		return this;
	}; // end METHOD accessors()

	/**
	* METHOD: stream()
	*	Returns a through stream for removing NaNs from a data stream.
	*/
	Stream.prototype.stream = function() {
		return through( onData( this._accessors ) );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();