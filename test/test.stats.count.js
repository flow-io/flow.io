
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	cStream = require( './../lib/stats/count' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/count', function tests() {

	it( 'should export a factory function', function test() {
		expect( cStream ).to.be.a( 'function' );
	});

	it( 'should have a reduce method factory', function test() {
		var rStream = cStream();
		expect( rStream.reduce ).to.be.a( 'function' );
	});

	it ( 'should have an initial accumulator value of 0', function test() {
		var rStream = cStream();
		assert.strictEqual( rStream._value, 0 );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = cStream();
		assert.strictEqual( rStream.value(), 0 );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = cStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should count piped data', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			rStream;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new count stream:
		rStream = cStream().stream();

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
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], numData );
		} // end FUNCTION onRead()
	});

	it( 'should count piped data using an arbitrary starting value', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			reducer, rStream,
			initValue = 999;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new count stream generator:
		reducer = cStream();

		// Set the initial count and create a new stream:
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
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], numData+initValue );
		} // end FUNCTION onRead()
	});

});