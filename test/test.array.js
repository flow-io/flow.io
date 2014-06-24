
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	aStream = require( './../lib/array' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'array', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( aStream ).to.be.a( 'function' );
	});

	it( 'should transform an array into a readable stream', function test( done ) {
		var numData = 1000,
			expected = new Array( numData ),
			tStream, s;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new array stream:
		tStream = aStream().stream();

		// Create the stream spec:
		s = spec( tStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( tStream, onRead );

		// Validate the stream when the stream closes:
		tStream.on( 'close', s.validate );

		// Mock piping a single array to the stream:
		utils.writeStream( [ expected ], tStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual, expected );
			done();
		} // end FUNCTION onRead()
	});

});