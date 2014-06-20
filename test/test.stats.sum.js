
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

	it( 'should return the sum value of piped data', function test( done ) {
		var data, rStream, s, SUM;

		// Simulate some data...
		data = [ 4, 4, 5, 5, 4, 4, 2, 2, 5, 5, 10 ];
		SUM = 0;
		for ( var i = 0; i < data.length; i++ ) {
			SUM += data[ i ];
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
		utils.writeStream( data, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], SUM );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should find the sum using an arbitrary starting value', function test( done ) {
		var data, reducer, rStream,
			SUM = 10000,
			INIT = SUM;

		// Simulate some data...
		data = [ 4, 4, 5, 5, 4, 4, 2, 2, 5, 5, 10 ];
		for ( var i = 0; i < data.length; i++ ) {
			SUM += data[ i ];
		}

		// Create a new sum stream generator:
		reducer = sStream();

		// Set the initial sum and create a new stream:
		rStream = reducer
			.value( INIT )
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
			assert.deepEqual( actual[ 0 ], SUM );
			done();
		} // end FUNCTION onRead()
	});

});