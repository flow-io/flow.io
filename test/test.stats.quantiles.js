
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	qStream = require( './../lib/stats/quantiles' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/quantiles', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( qStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the number of quantiles', function test() {
		var tStream = qStream();

		expect( tStream.quantiles() ).to.be.a( 'number' );
	});

	it( 'should set the default number of quantiles to 4 (quartiles)', function test() {
		var tStream = qStream();

		assert.strictEqual( tStream.quantiles(), 4 );
	});

	it( 'should provide a method to set the number of quantiles', function test() {
		var tStream = qStream();
		tStream.quantiles( 10 );
		assert.strictEqual( tStream.quantiles(), 10 );
	});

	it( 'should not allow a non-numeric quantile number', function test() {
		var tStream = qStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				tStream.value( value );
			};
		}
	});

	it( 'should compute the quantiles of piped data', function test( done ) {
		var data, expected, tStream;

		// Simulate some data...
		data = new Array( 20 );
		for ( var i = data.length; i > 0; i-- ) {
			data[ i-1 ] = i;
		}

		// Quantiles also returns the min and max (0th and 100th percentiles):
		expected = [ 1, 2.5, 4.5, 6.5, 8.5, 10.5, 12.5, 14.5, 16.5, 18.5, 20 ];

		// Create a new quantile stream:
		tStream = qStream()
			.quantiles( 10 )
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
			assert.deepEqual( actual[ 0 ], expected );
			done();
		} // end FUNCTION onRead()
	});

});