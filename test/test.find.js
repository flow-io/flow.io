
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

	it( 'should provide a method to get all data filters', function test() {
		var fStream = findStream();
		expect( fStream.filters() ).to.be.an( 'object' );
	});

	it( 'should not provide any default filters', function test() {
		var fStream = findStream();
		expect( fStream.filters() ).to.be.empty;
	});

	it( 'should provide a method to set data filters', function test() {
		var fStream = findStream(),
			x = function ( d ) {
				return ( d.x > 10 );
			},
			y =  function ( d ) {
				return ( d.y === 1 );
			};

		fStream.filters( 'x', x )
			.filters( 'y', y );

		assert.deepEqual( fStream.filters(), {
			'x': x,
			'y': y
		});
	});

	it( 'should provide a method to get a specific data filter', function test() {
		var fStream = findStream(),
			x = function ( d ) {
				return ( d.x % 2 );
			};

		fStream.filters( 'x', x );

		assert.strictEqual( fStream.filters( 'x' ), x );
	});

	it( 'should return undefined when attempting to get a data filter which does not exist', function test() {
		var fStream = findStream();

		assert.isUndefined( fStream.filters( 'd' ) );
	});

	it( 'should throw an error if one attempts to set a data filter to something other than a function', function test() {
		var fStream = findStream(),
			x = {};

		expect( setFilter ).to.throw( Error );

		function setFilter() {
			fStream.filters( 'x', x );
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
			.filters( 'd', function ( d ) {
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

	it( 'should find all piped data values satisfying multiple filter criteria for the same datum', function test( done ) {
		var data, expected, fStream, s;

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Extract the expected values:
		expected = [ 4, 4 ];

		// Create a new find stream:
		fStream = findStream()
			.filters( 'y1', function ( d ) {
				return ( d > 3 );
			})
			.filters( 'y2', function ( d ) {
				return ( d < 5 );
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

	it( 'should find all piped complex data values satisfying multiple filter criteria', function test( done ) {
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
			.filters( 'x', function ( d ) {
				return ( d.x > 1 && d.x < 5 );
			})
			.filters( 'y', function ( d ) {
				return ( d.y > 2 && d.y < 5 );
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