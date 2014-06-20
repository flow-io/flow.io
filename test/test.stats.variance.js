
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
		assert.strictEqual( rStream.value(), 0 );
	});

	it( 'should provide a method to get the initial accumulator value number', function test() {
		var rStream = vStream();
		assert.strictEqual( rStream.numValues(), 0 );
	});

	it( 'should provide a method to get the initial accumulator mean', function test() {
		var rStream = vStream();
		assert.strictEqual( rStream.mean(), 0 );
	});

	it( 'should provide a method to set the initial accumulator value', function test() {
		var rStream = vStream();
		rStream.value( 5 );
		assert.strictEqual( rStream.value(), 5 );
	});

	it( 'should provide a method to set the initial accumulator value number', function test() {
		var rStream = vStream();
		rStream.numValues( 5 );
		assert.strictEqual( rStream.numValues(), 5 );
	});

	it( 'should provide a method to set the initial accumulator mean', function test() {
		var rStream = vStream();
		rStream.mean( 5 );
		assert.strictEqual( rStream.mean(), 5 );
	});

	it( 'should calculate the variance of piped data', function test() {
		var numData = 1000,
			data = new Array( numData ),
			rStream;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = Math.random();
		}

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
			var sos = 0,
				mean = 0,
				delta = 0,
				variance;

			for ( var i = 0; i < numData; i++ ) {
				delta = data[ i ] - mean;
				mean += delta / (i+1);
				sos += delta * (data[i] - mean );
			}
			variance = sos / (numData-1);

			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], variance );
		} // end FUNCTION onRead()
	});

	it( 'should calculate the variance of piped data using an arbitrary starting sum of squared differences value', function test() {
		var numData = 1000,
			data = new Array( numData ),
			reducer, rStream,
			initValue = 500;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = Math.random() + 1000;
		}

		// Create a new variance stream generator:
		reducer = vStream();

		// Set the initial mean and create a new stream:
		rStream = reducer.value( initValue )
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
			var sos = initValue,
				mean = 0,
				delta = 0,
				variance;

			for ( var i = 0; i < numData; i++ ) {
				delta = data[ i ] - mean;
				mean += delta / (i+1);
				sos += delta * (data[i] - mean );
			}
			variance = sos / (numData-1);

			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], variance );
		} // end FUNCTION onRead()
	});

	it( 'should calculate the variance of piped data using an arbitrary starting value number', function test() {
		var numData = 1000,
			data = new Array( numData ),
			reducer, rStream,
			initValue = 1000;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = Math.random();
		}

		// Create a new variance stream generator:
		reducer = vStream();

		// Set the initial value number and create a new stream:
		rStream = reducer.numValues( initValue )
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
			var sos = 0,
				mean = 0,
				delta = 0,
				variance;

			for ( var i = 0; i < numData; i++ ) {
				delta = data[ i ] - mean;
				mean += delta / (initValue+i+1);
				sos += delta * (data[i] - mean );
			}
			variance = sos / (initValue+numData-1);

			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], variance );
		} // end FUNCTION onRead()
	});

	it( 'should calculate the variance of piped data using an arbitrary starting mean value', function test() {
		var numData = 1000,
			data = new Array( numData ),
			reducer, rStream,
			initValue = 1000;

		// Simulate some data...
		for ( var i = 0; i < numData; i++ ) {
			data[ i ] = Math.random();
		}

		// Create a new variance stream generator:
		reducer = vStream();

		// Set the initial mean value and create a new stream:
		rStream = reducer.mean( initValue )
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
			var sos = 0,
				mean = initValue,
				delta = 0,
				variance;

			for ( var i = 0; i < numData; i++ ) {
				delta = data[ i ] - mean;
				mean += delta / (i+1);
				sos += delta * (data[i] - mean );
			}
			variance = sos / (numData-1);

			expect( error ).to.not.exist;
			assert.deepEqual( actual[ 0 ], variance );
		} // end FUNCTION onRead()
	});

});