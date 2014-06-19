
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	mStream = require( './../lib/stats/max' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/max', function tests() {

	it( 'should export a factory function', function test() {
		expect( mStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = mStream();
		assert.strictEqual( rStream.value(), Number.NEGATIVE_INFINITY );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = mStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should return the maximum value of piped data', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			rStream;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random() * 1000;
		}

		// Create a new max stream:
		rStream = mStream().stream();

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
			var max = Number.NEGATIVE_INFINITY,
				value;
			for ( var i = 0; i < expected.length; i++ ) {
				value = expected[ i ];
				if ( value > max ) {
					max = value;
				}
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], max );
		} // end FUNCTION onRead()
	});

	it( 'should find the max using an arbitrary starting value', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			reducer, rStream,
			initValue = 10000;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			// No value should ever exceed the initial max value ( expected[ i ] exists on the interval: [0,1000] ):
			expected[ i ] = Math.random() * 1000;
		}

		// Create a new max stream generator:
		reducer = mStream();

		// Set the initial max and create a new stream:
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
			assert.deepEqual( actual[ 0 ], initValue );
		} // end FUNCTION onRead()
	});

});