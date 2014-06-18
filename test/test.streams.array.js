
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Assertion module:
	assert = require( 'assert' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	stream = require( './../lib/streams/array' );


// VARIABLES //

var expect = chai.expect;


// TESTS //

describe( 'streams/array', function() {

	it( 'should export a factory function', function() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should transform an array into a readable stream', function() {
		var numData = 1000,
			expected = new Array( numData ),
			aStream, s;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = Math.random();
		}

		// Create a new array stream:
		aStream = stream();

		// Create the stream spec:
		s = spec( aStream )
			.through();

		// Mock reading from the stream:
		utils.readStream( aStream, function onRead( error, actual ) {
			assert.ifError( error );
			assert.deepEqual( actual, expected );
		});

		// Validate the stream when the stream closes:
		aStream.on( 'close', s.validate );

		// Mock piping a single array to the stream:
		utils.writeStream( [ expected ], aStream );
	});

});