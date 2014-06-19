
// MODULES //

var // Path module:
	path = require( 'path' ),

	// Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	stream = require( './../lib/file/read.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'streams/file/read', function tests() {

	it( 'should export a factory function', function test() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if no path is provided', function test() {
		expect( stream ).to.throw( Error );
	});

	it( 'should return an error if file path does not exist', function test( done ) {
		stream( path.join( __dirname, 'file/does/not/exist.txt' ), onError );

		return;

		/**
		* FUNCTION: onError( error )
		*	Error event handler. Error is expected.
		*/
		function onError( error ) {
			expect( error ).to.exist;
			done();
		} // end FUNCTION onError()
	});

	it( 'should read a file', function test( done ){
		var filepath, rStream, s;

		// Specify the filepath:
		filepath = path.join( __dirname, 'utils/file.txt' );

		// Create a file read stream:
		rStream = stream( filepath, onError );

		// Create the stream spec:
		s = spec( rStream )
			.readable();

		// Mock reading from the stream:
		utils.readStream( rStream, onFinish );

		// Validate the stream when the stream closes:
		rStream.on( 'close', s.validate );

		return;

		/**
		* FUNCTION: onError( error )
		*	Error handler. Error should not exist.
		*/
		function onError( error ) {
			expect( error ).to.not.exist;
		} // end FUNCTION onError()

		/**
		* FUNCTION: onFinish( error, actual )
		*	Finish event handler. Checks for errors and ensures that the streamed data equals the expected data.
		*/
		function onFinish( error, actual ) {
			expect( error ).to.not.exist;
			actual = actual[ 0 ].toString();
			assert.equal( actual, '1234' );
			done();
		} // end FUNCTION onFinish()
	});

	it( 'should execute a callback when stream finishes', function test( done ) {
		var filepath, rStream;

		// Specify the filepath:
		filepath = path.join( __dirname, 'utils/file.txt' );

		// Create a file read stream:
		rStream = stream( filepath, onFinish );

		// Mock reading from the stream:
		utils.readStream( rStream, onError );

		return;

		/**
		* FUNCTION: onError( error )
		*	Error handler. Expect error to not exist.
		*/
		function onError( error ) {
			expect( error ).to.not.exist;
		} // end FUNCTION onError()

		/**
		* FUNCTION: onFinish( error )
		*	Finish event handler. Checks for errors. Confirms that callback was invoked.
		*/
		function onFinish( error ) {
			expect( error ).to.not.exist;
			assert.ok( true, 'callback invoked' );
			done();
		} // end FUNCTION onFinish()
	});

});