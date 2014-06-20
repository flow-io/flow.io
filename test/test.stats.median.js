
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	mStream = require( './../lib/stats/median' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/median', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( mStream ).to.be.a( 'function' );
	});

	it( 'should calculate the median of piped data', function test( done ) {
		var data, rStream, MEDIAN = 3.5;

		// Simulate some data... 3 2s, 3 3s, 3 4s, 3 5s
		data = [ 2, 3, 2, 4, 3, 3, 4, 2, 5, 4, 5, 5 ];

		// Create a new median stream:
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
			assert.closeTo( actual[ 0 ], MEDIAN, 0.001 );
			done();
		} // end FUNCTION onRead()
	});

});