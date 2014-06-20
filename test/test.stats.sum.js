
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	sStream = require( './../lib/stats/sum' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/sum', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( sStream ).to.be.a( 'function' );
	});

	it ( 'should have an initial accumulator value of 0', function test() {
		var rStream = sStream();
		assert.strictEqual( rStream._value, 0 );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = sStream();
		assert.strictEqual( rStream.value(), 0 );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = sStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should return the sum value of piped data', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			rStream, s;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random() * 1000;
		}

		// Create a new sum stream:
		rStream = sStream().stream();

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
			var sum = 0;
			for ( var i = 0; i < expected.length; i++ ) {
				sum += expected[ i ];
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], sum );
		} // end FUNCTION onRead()
	});

	it( 'should find the sum using an arbitrary starting value', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			reducer, rStream,
			initValue = 10000;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random() * 1000;
		}

		// Create a new sum stream generator:
		reducer = sStream();

		// Set the initial sum and create a new stream:
		rStream = reducer.value( initValue )
			.stream();

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
			var sum = initValue;
			for ( var i = 0; i < expected.length; i++ ) {
				sum += expected[ i ];
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], sum );
		} // end FUNCTION onRead()
	});

});