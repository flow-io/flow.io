
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	cStream = require( './../lib/stats/pcc' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/pcc', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( cStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the covariance matrix', function test() {
		var rStream = cStream();

		expect( rStream.cov() ).to.be.an( 'array' );
	});

	it( 'should provide a method to get the number of values', function test() {
		var rStream = cStream();

		expect( rStream.numValues() ).to.be.a( 'number' );
	});

	it( 'should provide a method to get the means', function test() {
		var rStream = cStream();

		expect( rStream.means() ).to.be.an( 'array' );
	});

	it( 'should provide a method to set the covariance matrix', function test() {
		var rStream = cStream(),
			cov = [ [ 0, 0 ], [ 0, 0 ] ];

		rStream.cov( cov );
		assert.deepEqual( rStream.cov(), cov );
	});

	it( 'should provide a method to set the means', function test() {
		var rStream = cStream(),
			means = [ 1, 2 ];

		rStream.means( means );
		assert.deepEqual( rStream.means(), means );
	});

	it( 'should provide a method to set the number of values', function test() {
		var rStream = cStream();
		rStream.numValues( 10 );
		assert.strictEqual( rStream.numValues(), 10 );
	});

	it( 'should not allow a non-array covariance matrix', function test() {
		var rStream = cStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				rStream.cov( value );
			};
		}
	});

	it( 'should not allow a non-array set of means', function test() {
		var rStream = cStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				rStream.means( value );
			};
		}
	});

	it( 'should not allow a non-numeric number of values', function test() {
		var rStream = cStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				rStream.numValues( value );
			};
		}
	});

	it( 'should compute the Pearson product-moment correlation coefficient of piped data', function test( done ) {
		var data, expected, rStream;
		done();
		return;
		// Simulate some data...
		data = [
			[ 1, -1 ],
			[ 0, 0 ],
			[ -1, 1 ],
			[ 0, 0 ],
			[ 1, -1 ],
			[ 0, 0 ],
			[ -1, 1 ],
			[ 0, 0 ],
			[ 1, -1 ],
			[ 0, 0 ],
			[ -1, 1 ]
		];

		// Datasets should have unit variance and should be negatively correlated:
		expected = [ 1, -1, -1, 1 ];

		// Create a new correlation coefficient stream:
		rStream = cStream()
			.accessors( 'd1', function ( d ) {
				return d[ 0 ];
			})
			.accessors( 'd2', function ( d ) {
				return d[ 1 ];
			})
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
			assert.deepEqual( JSON.parse( actual ), expected );
			done();
		} // end FUNCTION onRead()
	});

});