
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	stream = require( './../lib/reduce' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'reduce', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if a reduce function and accumulator are not provided', function test() {
		expect( stream ).to.throw( Error );
		expect( getStream ).to.throw( Error );
		return;

		/**
		* FUNCTION: getStream()
		*	Supplies a single argument to the stream generator.
		*
		* @returns {Stream} reduce stream
		*/
		function getStream() {
			return stream( function reduce( count, x ) {
				return count + 1;
			});
		} // end FUNCTION getStream()
	});

	it( 'should return a single value', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			rStream, s,

			// Return last value:
			reduce = function ( acc, val ) {
				acc = val;
				return acc;
			};

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new reduce stream:
		rStream = stream( reduce, 0 );

		// Create the stream spec:
		s = spec( rStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( rStream, onRead );

		// Validate the stream when the stream closes:
		rStream.on( 'close', s.validate );

		// Mock piping a data to the stream:
		utils.writeStream( expected, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			var lastVal = expected[ expected.length-1 ];
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], lastVal );
		} // end FUNCTION onRead()
	});

	it( 'should allow for arbitrary reduce functions', function test() {
		var expected = new Array( 10 ),
			rStream,

			// Compute a factorial:
			reduce = function ( acc, val ) {
				acc *= val;
				return acc;
			};

		// Simulate some data...
		for ( var i = 1; i < 11; i++ ) {
			expected[ i-1 ] = i;
		}

		// Create a new reduce stream:
		rStream = stream( reduce, 1 );

		// Mock reading from the stream:
		utils.readStream( rStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( expected, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			var val = 1;
			for ( var i = 0; i < expected.length; i++ ) {
				val = val * expected[ i ];
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], val );
		} // end FUNCTION onRead()
	});

});