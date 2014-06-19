
// MODULES //

var // Filesystem module:
	fs = require( 'fs' ),

	// Path module:
	path = require( 'path' ),

	// Expectation library:
	chai = require( 'chai' ),

	// Stream spec:
	spec = require( 'stream-spec' ),

	// Test utilities:
	utils = require( './utils' ),

	// Module to be tested:
	stream = require( './../lib/streams/file/write.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'streams/file/write', function tests() {

	it( 'should export a factory function', function test() {
		expect( stream ).to.be.a( 'function' );
	});

	it( 'should throw an error if no destination path is provided', function test() {
		expect( stream ).to.throw( Error );
	});

	it( 'should write to a file', function test( done ){
		var numData = 1000,
			expected = new Array( numData ),
			filepath, wStream;

		// Create mock data:
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = '' + Math.round( 1000 * Math.random() );
		}

		// Specify the output file destination:
		filepath = path.join( __dirname, 'tmp/write1.txt' );

		// Create a file write stream:
		wStream = stream( filepath, onError );

		// Mock writing to the stream:
		utils.writeStream( expected, wStream );

		return;

		/**
		* FUNCTION: onError( error )
		*	Error handler. Error should not exist.
		*/
		function onError( error ) {
			expect( error ).to.not.exist;
			fs.unlink( filepath, function onError( error ) {
				if ( error ) {
					console.error( error.stack );
				}
			});
			done();
		} // end FUNCTION onError()
	});

	it( 'should execute a callback when stream finishes', function test( done ) {
		var numData = 1000,
			expected = new Array( numData ),
			filepath, wStream;

		// Create mock data:
		for ( var i = 0; i < numData; i++ ) {
			expected[ i ] = '' + Math.round( 1000 * Math.random() );
		}

		// Specify the output file destination:
		filepath = path.join( __dirname, 'tmp/write2.txt' );

		// Create a file write stream:
		wStream = stream( filepath, onFinish );

		// Mock writing to the stream:
		utils.writeStream( expected, wStream );

		return;

		/**
		* FUNCTION: onFinish( error )
		*	Finish event handler. Checks for errors and confirms callback invoked.
		*/
		function onFinish( error ) {
			expect( error ).to.not.exist;
			assert.ok( true, 'callback invoked' );
			fs.unlink( filepath, function onError( error ) {
				if ( error ) {
					console.error( error.stack );
				}
			});
			done();
		} // end FUNCTION onFinish()
	});

});