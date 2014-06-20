
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

	it( 'should provide a method to get all data accessors', function test() {
		var fStream = findStream();
		expect( fStream.accessors() ).to.be.an( 'object' );
	});

	it( 'should not provide any default accessors', function test() {
		var fStream = findStream();
		expect( fStream.accessors() ).to.be.empty;
	});

	it( 'should provide a method to get all data filters', function test() {
		var fStream = findStream();
		expect( fStream.filters() ).to.be.an( 'object' );
	});

	it( 'should not provide any default filters', function test() {
		var fStream = findStream();
		expect( fStream.filters() ).to.be.empty;
	});

	it( 'should provide a method to set data accessors', function test() {
		var fStream = findStream(),
			x = function ( d ) {
				return d.x;
			},
			y =  function ( d ) {
				return d.y;
			};
		fStream.accessors( 'x', x )
			.accessors( 'y', y );
		assert.deepEqual( fStream.accessors(), {
			'x': x,
			'y': y
		});
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

	it( 'should provide a method to get a specific data accessor', function test() {
		var fStream = findStream(),
			x = function ( d ) {
				return d.x;
			},
			y =  function ( d ) {
				return d.y;
			};
		fStream.accessors( 'x', x )
			.accessors( 'y', y );
		assert.strictEqual( fStream.accessors( 'x' ), x );
	});

	it( 'should provide a method to get a specific data filter', function test() {
		var fStream = findStream(),
			x = function ( d ) {
				return ( d.x % 2 );
			};
		fStream.filters( 'x', x );
		assert.strictEqual( fStream.filters( 'x' ), x );
	});

	it( 'should return undefined when attempting to get a data accessor which does not exist', function test() {
		var fStream = findStream();

		assert.isUndefined( fStream.accessors( 'd' ) );
	});

	it( 'should return undefined when attempting to get a data filter which does not exist', function test() {
		var fStream = findStream();

		assert.isUndefined( fStream.filters( 'd' ) );
	});

	it( 'should throw an error if one attempts to set a data accessor to something other than a function', function test() {
		var fStream = findStream(),
			x = 'x';

		expect( setAccessor ).to.throw( Error );

		function setAccessor() {
			fStream.accessors( 'x', x );
		}
	});

	it( 'should throw an error if one attempts to set a data filter to something other than a function', function test() {
		var fStream = findStream(),
			x = {};

		expect( setFilter ).to.throw( Error );

		function setFilter() {
			fStream.filters( 'x', x );
		}
	});

	it( 'should throw an error if number of accessors and filters are not equal', function test() {
		var data,
			fStream = findStream(),
			xAcc = function ( d ) {
				return d.x;
			},
			xFilter = function ( d ) {
				return ( d.x > 0 );
			},
			yFilter = function ( d ) {
				return ( d.y === true );
			};

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Attempt to run the stream:
		expect( unequal ).to.throw( Error );

		return;

		function unequal() {
			var stream;

			fStream.accessors( 'x', xAcc )
				.filters( 'x', xFilter )
				.filters( 'y', yFilter );

			stream = fStream.stream();

			// Mock reading from the stream:
			utils.readStream( stream, onRead );

			// Mock piping a data to the stream:
			utils.writeStream( data, stream );

		} // end FUNCTION unequal()
	});

	it( 'should throw an error if an accessor does not have a corresponding filter', function test() {
		var data,
			fStream = findStream(),
			xAcc = function ( d ) {
				return d.x;
			},
			xFilter = function ( d ) {
				return ( d.x > 0 );
			};

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Attempt to run the stream:
		expect( doNotCorrespond ).to.throw( Error );

		return;

		function doNotCorrespond() {
			var stream;

			fStream.accessors( 'time', xAcc )
				.filters( 'x', xFilter );

			stream = fStream.stream();

			// Mock reading from the stream:
			utils.readStream( stream, onRead );

			// Mock piping a data to the stream:
			utils.writeStream( data, stream );

		} // end FUNCTION doNotCorrespond()
	});

	it( 'should find all piped data values satisfying filter criteria', function test( done ) {
		var data, expected, fStream, s;

		// Simulate some data...
		data = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Extract the expected values:
		expected = [ 5, 4, 4, 6 ];

		// Create a new find stream:
		fStream = findStream()
			.accessors( 'd', function ( d ) {
				return d;
			})
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

});