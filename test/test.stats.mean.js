
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

	it( 'should calculate the mean of piped data', function test( done ) {
		var data, rStream, MEAN = 3.5;

		// Simulate some data...
		data = [ 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5 ];

		// Create a new mean stream:
		rStream = mStream().stream();

		// Mock reading from the stream:
		utils.readStream( rStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.closeTo( actual[ 0 ], MEAN, 0.001 );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should calculate the mean of piped data using an arbitrary starting mean value and corresponding number of values the mean represents', function test( done ) {
		var data, reducer, rStream,
			MEAN = 10000,
			NUMVALUES = 100,
			INIT = MEAN,
			sum;

		// Simulate some data...
		data = [ 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5 ];
		
		sum = MEAN * NUMVALUES;
		for ( var i = 0; i < data.length; i++ ) {
			sum += data[ i ];
		}
		MEAN = sum / (data.length+NUMVALUES);
			
		// Create a new mean stream generator:
		reducer = mStream();

		// Set the initial mean and create a new stream:
		rStream = reducer
			.value( INIT )
			.numValues( NUMVALUES )
			.stream();

		// Mock reading from the stream:
		utils.readStream( rStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.closeTo( actual[ 0 ], MEAN, 0.0001 );
			done();
		} // end FUNCTION onRead()
	});

});