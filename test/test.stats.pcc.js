
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


// FUNCTIONS //

/**
* FUNCTION: randn( length )
*	Generate normally distributed random numbers. Implementation: Box-Muller method.
*
* @private
* @param {number} length - (optional) number of random variates to generate; default: 1
* @returns {array|number} array of random normal variates or a single random normal variate
*/
function randn( length ) {
	var urand, vrand,
		numValues = length || 1,
		vec = new Array( numValues );

	for ( var i = 0; i < numValues; i++ ) {
		urand = Math.random();
		vrand = Math.random();
		vec[ i ] = Math.sqrt( -2*Math.log( urand ) ) * Math.cos( 2*Math.PI*vrand );
	} // end FOR i

	if ( numValues === 1 ) {
		return vec[0];
	}
	return vec;
} // end FUNCTION randn()


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

	it( 'should provide a method to get all data accessors', function test() {
		var rStream = cStream();
		expect( rStream.accessors() ).to.be.an( 'object' );
	});

	it( 'should not provide any default accessors', function test() {
		var rStream = cStream();
		expect( rStream.accessors() ).to.be.empty;
	});

	it( 'should provide a method to set data accessors', function test() {
		var rStream = cStream(),
			x = function ( d ) {
				return d.x;
			},
			y =  function ( d ) {
				return d.y;
			};

		rStream.accessors( 'x', x )
			.accessors( 'y', y );

		assert.deepEqual( rStream.accessors(), {
			'x': x,
			'y': y
		});
	});

	it( 'should provide a method to get a specific data accessor', function test() {
		var rStream = cStream(),
			x = function ( d ) {
				return d.x;
			},
			y =  function ( d ) {
				return d.y;
			};

		rStream.accessors( 'x', x )
			.accessors( 'y', y );

		assert.strictEqual( rStream.accessors( 'x' ), x );
	});

	it( 'should return undefined when attempting to get a data accessor which does not exist', function test() {
		var rStream = cStream();

		assert.isUndefined( rStream.accessors( 'd' ) );
	});

	it( 'should throw an error if one attempts to set a data accessor to something other than a function', function test() {
		var rStream = cStream();

		expect( badAccessor( '5' ) ).to.throw( Error );
		expect( badAccessor( 5 ) ).to.throw( Error );
		expect( badAccessor( [] ) ).to.throw( Error );
		expect( badAccessor( {} ) ).to.throw( Error );
		expect( badAccessor( null ) ).to.throw( Error );
		expect( badAccessor( undefined ) ).to.throw( Error );
		expect( badAccessor( NaN ) ).to.throw( Error );

		function badAccessor( value ) {
			return function() {
				rStream.accessors( 'x', value );
			};
		}
	});

	it( 'should compute the Pearson product-moment correlation coefficient of (negatively correlated) piped data', function test( done ) {
		var data, expected, rStream;
		
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
		expected = [
			[ 1, -1 ],
			[ -1, 1 ]
		];

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
			assert.deepEqual( actual[ 0 ], expected );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should compute the Pearson product-moment correlation coefficient of (positively correlated) piped data', function test( done ) {
		var data, expected, rStream;
		
		// Simulate some data...
		data = [
			[ 1, 1 ],
			[ 0, 0 ],
			[ -1, -1 ],
			[ 0, 0 ],
			[ 1, 1 ],
			[ 0, 0 ],
			[ -1, -1 ],
			[ 0, 0 ],
			[ 1, 1 ],
			[ 0, 0 ],
			[ -1, -1 ]
		];

		// Datasets should have unit variance and should be positively correlated:
		expected = [
			[ 1, 1 ],
			[ 1, 1 ]
		];

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
			assert.deepEqual( actual[ 0 ], expected );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should compute the Pearson product-moment correlation coefficient of (uncorrelated) piped data', function test( done ) {
		var numData = 10000,
			data = new Array( numData ),
			expected, rStream;
		
		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = [ randn(), randn() ];
		}

		// Datasets should have unit variance and should be (approximately) uncorrelated (law of large numbers):
		expected = [
			[ 1, 0 ],
			[ 0, 1 ]
		];

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
			var corr = actual[ 0 ];

			expect( error ).to.not.exist;

			assert.closeTo( corr[0][0], expected[0][0], 0.05 );
			assert.closeTo( corr[0][1], expected[0][1], 0.05 );
			assert.closeTo( corr[1][0], expected[1][0], 0.05 );
			assert.closeTo( corr[1][1], expected[1][1], 0.05 );

			done();
		} // end FUNCTION onRead()
	});

});