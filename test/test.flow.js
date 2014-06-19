
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
	var properties = [
			'read',
			'write',
			'parse',
			'stringify',
			'array',
			'reduce',
			'transform',
			'count',
			'covariance',
			'histc',
			'iqr',
			'kde',
			'kurtosis',
			'max',
			'mean',
			'median',
			'min',
			'mmean',
			'mva',
			'mvariance',
			'pcc',
			'quantiles',
			'skewness',
			'sum',
			'variance',
			'outliers',
			'mOutliers',
			'eOutliers',
			'find'
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