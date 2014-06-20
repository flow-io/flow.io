
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	mStream = require( './../lib/stats/mean' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/mean', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( mStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = mStream();
		assert.strictEqual( rStream.value(), 0 );
	});

	it( 'should provide a method to get the initial accumulator value number', function test() {
		var rStream = mStream();
		assert.strictEqual( rStream.numValues(), 0 );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = mStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should provide a method to set the initial accumulator value number', function test() {
		var rStream = mStream();
		rStream.numValues( 5 );
		assert.strictEqual( rStream.numValues(), 5 );
	});

	it( 'should calculate the mean of piped data', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			rStream;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new mean stream:
		rStream = mStream().stream();

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
			var mean = 0, delta = 0;
			for ( var i = 0; i < numData; i++ ) {
				delta = expected[ i ] - mean;
				mean += delta / (i+1);
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], mean );
		} // end FUNCTION onRead()
	});

	it( 'should count piped data using an arbitrary starting mean value', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			reducer, rStream,
			initValue = 1005;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random() + 1000;
		}

		// Create a new mean stream generator:
		reducer = mStream();

		// Set the initial mean and create a new stream:
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
			var mean = initValue, delta = 0;
			for ( var i = 0; i < numData; i++ ) {
				delta = expected[ i ] - mean;
				mean += delta / (i+1);
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], mean );
		} // end FUNCTION onRead()
	});

	it( 'should count piped data using an arbitrary starting value number', function test() {
		var numData = 1000,
			expected = new Array( numData ),
			reducer, rStream,
			initValue = 1000;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new mean stream generator:
		reducer = mStream();

		// Set the initial value number and create a new stream:
		rStream = reducer.numValues( initValue )
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
			var mean = 0, delta = 0;
			for ( var i = 0; i < numData; i++ ) {
				delta = expected[ i ] - mean;
				mean += delta / (initValue+i+1);
			}
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], mean );
		} // end FUNCTION onRead()
	});

});