
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	mStream = require( './../lib/stats/mmean' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/mean', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( mStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the window size', function test() {
		var tStream = mStream();
		assert.strictEqual( tStream.window(), 5 );
	});

	it( 'should provide a method to set the window size', function test() {
		var tStream = mStream();
		tStream.window( 25 );
		assert.strictEqual( tStream.window(), 25 );
	});

	it( 'should not allow a non-numeric window size', function test() {
		var tStream = mStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				tStream.window( value );
			};
		}
	});

	it( 'should calculate the mean of piped data', function test( done ) {
		var data, expected, tStream, WINDOW = 5;

		// Simulate some data...
		data = [ 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5 ];

		// Expected values is the rolling average:
		expected = [ 2.4, 2.6, 3, 3.4, 3.6, 4, 4.4, 4.6 ];

		// Create a new mean stream:
		tStream = mStream()
			.window( WINDOW )
			.stream();

		// Mock reading from the stream:
		utils.readStream( tStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, tStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;

			assert.lengthOf( actual, data.length-WINDOW+1 );

			assert.closeTo( actual[ 0 ], expected[ 0 ], 0.001 );
			assert.closeTo( actual[ 1 ], expected[ 1 ], 0.001 );
			assert.closeTo( actual[ 2 ], expected[ 2 ], 0.001 );
			assert.closeTo( actual[ 3 ], expected[ 3 ], 0.001 );
			assert.closeTo( actual[ 4 ], expected[ 4 ], 0.001 );
			assert.closeTo( actual[ 5 ], expected[ 5 ], 0.001 );
			assert.closeTo( actual[ 6 ], expected[ 6 ], 0.001 );
			assert.closeTo( actual[ 7 ], expected[ 7 ], 0.001 );

			done();
		} // end FUNCTION onRead()
	});

	it( 'should calculate the mean of piped data using an arbitrary window size', function test( done ) {
		var data, expected, tStream, WINDOW = 3;

		// Simulate some data...
		data = [ 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5 ];

		// Expected values is the rolling average:
		expected = [ 2, 2.33333, 2.666666, 3, 3.33333333, 3.6666666, 4, 4.33333333, 4.66666666, 5 ];

		// Create a new mean stream:
		tStream = mStream()
			.window( WINDOW )
			.stream();

		// Mock reading from the stream:
		utils.readStream( tStream, onRead );

		// Mock piping a data to the stream:
		utils.writeStream( data, tStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;

			assert.lengthOf( actual, data.length-WINDOW+1 );

			assert.closeTo( actual[ 0 ], expected[ 0 ], 0.001 );
			assert.closeTo( actual[ 1 ], expected[ 1 ], 0.001 );
			assert.closeTo( actual[ 2 ], expected[ 2 ], 0.001 );
			assert.closeTo( actual[ 3 ], expected[ 3 ], 0.001 );
			assert.closeTo( actual[ 4 ], expected[ 4 ], 0.001 );
			assert.closeTo( actual[ 5 ], expected[ 5 ], 0.001 );
			assert.closeTo( actual[ 6 ], expected[ 6 ], 0.001 );
			assert.closeTo( actual[ 7 ], expected[ 7 ], 0.001 );
			assert.closeTo( actual[ 8 ], expected[ 8 ], 0.001 );
			assert.closeTo( actual[ 9 ], expected[ 9 ], 0.001 );

			done();
		} // end FUNCTION onRead()
	});

	

});