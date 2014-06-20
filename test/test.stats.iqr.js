
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	qStream = require( './../lib/stats/iqr' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/iqr', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( qStream ).to.be.a( 'function' );
	});

	it( 'should compute the interquartile range of piped data', function test( done ) {
		var data, tStream;

		// Simulate some data... (quartiles: 4, 6; iqr: 2)
		data = [ 5, 6, 6, 4, 3, 3, 5, 7, 4, 7 ];

		// Create a new iqr stream:
		tStream = qStream().stream();

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
			assert.strictEqual( actual[ 0 ], 2 );
			done();
		} // end FUNCTION onRead()
	});

});