
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	binsearch = require( './../lib/stats/histc/binsearch.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/histc/binsearch', function tests() {
	'use strict';

	it( 'should export a function', function test() {
		expect( binsearch ).to.be.a( 'function' );
	});

	it( 'should require two input arguments: edge vector and value', function test() {
		expect( binsearch ).to.throw( Error );
		expect( function() { binsearch([]); } ).to.throw( Error );
	});

	it( 'should take a 1d array which defines the bin edges as its first argument', function test() {
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( 99 ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( arr ) {
			return function() {
				binsearch( arr, 0 );
			};
		}
	});

	it( 'should take a numeric value as its second argument', function test() {
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				binsearch( [], value );
			};
		}
	});

	it( 'should return a bin index corresponding to the value\'s bin', function test() {
		var edges = [ 0.5, 1.5, 2.5, 3.5, 4.5, 5.5 ],
			value = 2;

		assert.strictEqual( binsearch( edges, value ), 1 );
	});

	it( 'should return -1 when a value is less than the min edge', function test() {
		var edges = [ 0.5, 1.5, 2.5, 3.5, 4.5, 5.5 ],
			value = 0;

		assert.strictEqual( binsearch( edges, value ), -1 );
	});

	it( 'should return the index of the max edge when a value is greater than the max edge', function test() {
		var edges = [ 0.5, 1.5, 2.5, 3.5, 4.5, 5.5 ],
			value = 6;

		assert.strictEqual( binsearch( edges, value ), 5 );
	});

});