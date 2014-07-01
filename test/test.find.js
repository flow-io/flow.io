
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	findStream = require( './../lib/find' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'find', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( findStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get the data filter', function test() {
		var fStream = findStream();
		expect( fStream.filter ).to.be.a( 'function' );
	});

	it( 'should not provide a default filter', function test() {
		var fStream = findStream();
		assert.isNull( fStream.filter() );
	});

	it( 'should provide a method to set the data filter', function test() {
		var fStream = findStream(),
			filter = function ( d ) {
				return ( d.x > 10 );
			};

		fStream.filter( filter );

		assert.deepEqual( fStream.filter(), filter );
	});

	it( 'should throw an error if one attempts to set the data filter to something other than a function', function test() {
		var fStream = findStream();

		expect( badValue( 5 ) ).to.throw( Error );
		expect( badValue( '5' ) ).to.throw( Error );
		expect( badValue( null ) ).to.throw( Error );
		expect( badValue( undefined ) ).to.throw( Error );
		expect( badValue( true ) ).to.throw( Error );
		expect( badValue( [] ) ).to.throw( Error );
		expect( badValue( {} ) ).to.throw( Error );
		expect( badValue( NaN ) ).to.throw( Error );

		function badValue( value ) {
			return function() {
				fStream.filter( value );
			};
		}
	});

	it( 'should find all piped data values satisfying filter criteria', function test( done ) {
		var data, expected, fStream, s;

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Extract the expected values:
		expected = [ 5, 4, 4, 6 ];

		// Create a new find stream:
		fStream = findStream()
			.filter( function ( d ) {
				return ( d >= 4 );
			})
			.stream();

		// Create the stream spec:
		s = spec( fStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( fStream, onRead );

		// Validate the stream when the stream closes:
		fStream.on( 'close', s.validate );

		// Mock piping a data to the stream:
		utils.writeStream( data, fStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual, expected );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should find all piped data values satisfying arbitrarily complex filter criteria', function test( done ) {
		var data, expected, fStream, s;

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Extract the expected values:
		expected = [ 4, 4 ];

		// Create a new find stream:
		fStream = findStream()
			.filter( function ( d ) {
				return ( d > 3 ) && ( d < 5 );
			})
			.stream();

		// Create the stream spec:
		s = spec( fStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( fStream, onRead );

		// Validate the stream when the stream closes:
		fStream.on( 'close', s.validate );

		// Mock piping a data to the stream:
		utils.writeStream( data, fStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual, expected );
			done();
		} // end FUNCTION onRead()
	});

	it( 'should find all complex piped data values satisfying filter criteria', function test( done ) {
		var data, expected, fStream, s;

		// Simulate some data...
		data = [
			{
				'x': 0,
				'y': 5
			},
			{
				'x': 1,
				'y': 4
			},
			{
				'x': 2,
				'y': 3
			},
			{
				'x': 3,
				'y': 4
			},
			{
				'x': 4,
				'y': 2
			},
			{
				'x': 5,
				'y': 6
			},
			{
				'x': 6,
				'y': 3
			}
		];

		// Extract the expected values:
		expected = [
			{
				'x': 2,
				'y': 3
			},
			{
				'x': 3,
				'y': 4
			}
		];

		// Create a new find stream:
		fStream = findStream()
			.filter( function ( d ) {
				return ( d.x > 1 && d.x < 5 ) && ( d.y > 2 && d.y < 5 );
			})
			.stream();

		// Create the stream spec:
		s = spec( fStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( fStream, onRead );

		// Validate the stream when the stream closes:
		fStream.on( 'close', s.validate );

		// Mock piping a data to the stream:
		utils.writeStream( data, fStream );

		return;

		/**
		* FUNCTION: onRead( error, actual )
		*	Read event handler. Checks for errors and compares streamed data to expected data.
		*/
		function onRead( error, actual ) {
			expect( error ).to.not.exist;
			assert.deepEqual( actual, expected );
			done();
		} // end FUNCTION onRead()
	});

});