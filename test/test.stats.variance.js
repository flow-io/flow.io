
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	vStream = require( './../lib/stats/variance' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'stats/variance', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( vStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the initial accumulator value', function test() {
		var rStream = vStream();
		expect( rStream.value() ).to.be.a( 'number' );
	});

	it( 'should provide a method to get the initial accumulator value number', function test() {
		var rStream = vStream();
		expect( rStream.numValues() ).to.be.a( 'number' );
	});

	it( 'should provide a method to get the initial accumulator mean', function test() {
		var rStream = vStream();
		expect( rStream.mean() ).to.be.a( 'number' );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = vStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should not allow a non-numeric initial accumulator value', function test() {
		var rStream = vStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				rStream.value( value );
			};
		}
	});

	it( 'should provide a method to set the initial accumulator value number', function test() {
		var rStream = vStream();
		rStream.numValues( 5 );
		assert.strictEqual( rStream.numValues(), 5 );
	});

	it( 'should not allow a non-numeric initial accumulator value number', function test() {
		var rStream = vStream();
		
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

	it( 'should provide a method to set the initial accumulator mean', function test() {
		var rStream = vStream();
		rStream.mean( 5 );
		assert.strictEqual( rStream.mean(), 5 );
	});

	it( 'should not allow a non-numeric initial accumulator mean', function test() {
		var rStream = vStream();
		
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				rStream.mean( value );
			};
		}
	});

	it( 'should calculate the variance of piped data', function test( done ) {
		var data, rStream,
			x2 = 0,
			VARIANCE;

		// Simulate some data...
		data = [ -1, 0, 1, -1, 0, 1, -1, 0, 1 ];

		// E[X^2] - (E[X])^2; Here, E[X] = 0.
		for ( var i = 0; i < data.length; i++ ) {
			x2 += data[ i ] * data[ i ];
		}
		VARIANCE = x2 / ( data.length - 1 );

		// Create a new variance stream:
		rStream = vStream().stream();

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
			assert.deepEqual( actual[ 0 ], VARIANCE );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should calculate the variance of piped data using arbitrary starting values', function test( done ) {
		var data, reducer, rStream,
			MEAN = 0,
			NUMVALUES = 100,
			SOS = 99; // 100-1 to adjust for sample variance, which is greater than population variance

		// Simulate some data...
		data = [ -1, 1, -1, 1, -1, 1, -1, 1, -1, 1 ];

		// Create a new variance stream generator:
		reducer = vStream();

		// Set the initial mean and create a new stream:
		rStream = reducer
			.value( SOS )
			.mean( MEAN )
			.numValues( NUMVALUES )
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
			assert.closeTo( actual[ 0 ], 1 , 0.001 );
			done();
		} // end FUNCTION onRead()
	});

});