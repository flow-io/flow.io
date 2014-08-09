
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	flow = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// FUNCTIONS //

/**
* FUNCTION: test_property( name )
*	Tests that the flow library has a property and that the property value is a function.
*
* @param {string} name - property name
*/
function test_property( name ) {
	it ( 'should have a `'+ name + '` property that is a function', function test() {
		expect( flow ).to.have.property( name ).that.is.a( 'function' );
	});
} // end FUNCTION test_property()


// TESTS //

describe( 'flow.io', function tests() {
	'use strict';

	var properties = [
			'read',
			'write',
			'parse',
			'stringify',
			'array',
			'map',
			'reduce',
			'abs',
			'round',
			'floor',
			'ceil',
			'add',
			'subtract',
			'multiply',
			'divide',
			'pow',
			'exp',
			'count',
			'covariance',
			'histc',
			'iqr',
			'kde',
			'kurtosis',
			'max',
			'mmax',
			'mean',
			'median',
			'min',
			'mmin',
			'mmean',
			'mva',
			'mvariance',
			'pcc',
			'quantiles',
			'skewness',
			'sum',
			'msum',
			'csum',
			'variance',
			'outliers',
			'mOutliers',
			'eOutliers',
			'find',
			'nans'
		];

	it( 'should export an object', function test() {
		expect( flow ).to.be.an( 'object' );
	});

	it ( 'should only have the properties specified in the tests', function test() {
		assert.strictEqual( Object.keys( flow ).length, properties.length );
	});

	// Run the property tests...
	for ( var i = 0; i < properties.length; i++ ) {
		test_property( properties[ i ] );
	}

});