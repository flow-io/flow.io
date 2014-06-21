
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	nStream = require( './../lib/filter/nan' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'filter/nan', function tests() {
	'use strict';

	it( 'should export a factory function', function test() {
		expect( nStream ).to.be.a( 'function' );
	});

	it( 'should provide a method to get all data accessors', function test() {
		var fStream = nStream();
		expect( fStream.accessors() ).to.be.an( 'object' );
	});

	it( 'should not provide any default accessors', function test() {
		var fStream = nStream();
		expect( fStream.accessors() ).to.be.empty;
	});

	it( 'should provide a method to set data accessors', function test() {
		var fStream = nStream(),
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

	it( 'should provide a method to get a specific data accessor', function test() {
		var fStream = nStream(),
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

	it( 'should return undefined when attempting to get a data accessor which does not exist', function test() {
		var fStream = nStream();

		assert.isUndefined( fStream.accessors( 'd' ) );
	});

	it( 'should throw an error if one attempts to set a data accessor to something other than a function', function test() {
		var fStream = nStream();

		expect( badAccessor( '5' ) ).to.throw( Error );
		expect( badAccessor( 5 ) ).to.throw( Error );
		expect( badAccessor( [] ) ).to.throw( Error );
		expect( badAccessor( {} ) ).to.throw( Error );
		expect( badAccessor( null ) ).to.throw( Error );
		expect( badAccessor( undefined ) ).to.throw( Error );
		expect( badAccessor( NaN ) ).to.throw( Error );

		function badAccessor( value ) {
			return function() {
				fStream.accessors( 'x', value );
			};
		}
	});

	it( 'should filter (remove) all non-numeric piped data', function test( done ) {
		var data, expected, fStream, s;

		// Simulate some data...
		data = [ 5, 4, 'a', 3, 4, null, 2, undefined, NaN, {}, 6, [ 4, 3 ], function(){}, 3 ];

		// Extract the expected values:
		expected = [ 5, 4, 3, 4, 2, 6, 3 ];

		// Create a new filter stream:
		fStream = nStream()
			.accessors( 'd', function ( d ) {
				return d;
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