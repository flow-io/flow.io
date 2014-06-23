
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

	it ( 'should take a 1d array which defines the bin edges as its first argument', function test() {
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

	it ( 'should take a numeric value as its second argument', function test() {
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

});