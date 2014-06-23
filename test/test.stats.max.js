
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
	'use strict';

	it( 'should export a factory function', function test() {
		expect( mStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = mStream();
		expect( rStream.value() ).to.be.a( 'number' );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = mStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should not allow a non-numeric max value', function test() {
		var rStream = mStream();
		
		expect( badMax( '5' ) ).to.throw( Error );
		expect( badMax( [] ) ).to.throw( Error );
		expect( badMax( {} ) ).to.throw( Error );
		expect( badMax( null ) ).to.throw( Error );
		expect( badMax( undefined ) ).to.throw( Error );
		expect( badMax( NaN ) ).to.throw( Error );

		function badMax( value ) {
			return function() {
				rStream.value( value );
			};
		}
	});

	it( 'should return the maximum value of piped data', function test( done ) {
		var data, rStream, s,
			MAX = 10;

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, MAX, 3 ];

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
		utils.writeStream( data, rStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], MAX );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should find the max using an arbitrary starting value', function test( done ) {
		var data, reducer, rStream,
			MAX = 11;

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 10, 3 ];

		// Create a new max stream generator:
		reducer = mStream();

		// Set the initial max and create a new stream:
		rStream = reducer.value( MAX )
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
			assert.deepEqual( actual[ 0 ], MAX );
			done();
		} // end FUNCTION onRead()
	});

});