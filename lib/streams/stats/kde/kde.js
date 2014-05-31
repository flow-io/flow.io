/**
*
*	STATS: Kernel Density Estimate
*
*
*
*	DESCRIPTION:
*		- 
*
*
*	API:
*		- 
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/05/17: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Module containing probability density functions (pdfs):
		pdf = require( './pdf' );


	// FUNCTIONS //

	/**
	* FUNCTION: linspace( min, max, increment )
	*	Generate a linearly spaced vector.
	*
	* @param {number} min - min defines the vector lower bound
	* @param {number} max - max defines the vector upper bound
	* @param {number} increment - distance between successive vector elements
	* @returns {array} a 1-dimensional array
	*/
	function linspace( min, max, increment ) {
		var numElements, vec = [];

		numElements = Math.round( ( ( max - min ) / increment ) ) + 1;

		vec[ 0 ] = min;
		vec[ numElements - 1] = max;

		for ( var i = 1; i < numElements - 1; i++ ) {
			vec[ i ] = min + increment*i;
		}
		return vec;
	} // end FUNCTION linspace()

	/**
	* FUNCTION: kde_estimator_silverman( vector )
	*	Use's Silverman's rule of thumb to derive an empirical estimate for an optimal KDE bandwidth selection.
	* Source:
	*	Silverman, B.W. (1998). Density Estimation for Statistics and Data Analysis. London: Chapman & Hall/CRC. p. 48. ISBN 0-412-24620-1.
	*
	* @param {array} vector - 1d array over which to compute the estimate
	* @returns {number} bandwidth estimate
	*/
	function kde_estimator_silverman( vector ) {
		var sigma, N = vector.length, A;

		// [0] Calculate the sample standard deviation:
		sigma = stdev( vector );

		// [1] Calculate the estimator:
		A = Math.pow( ( 4/(3*N) ), 0.2 );
		return A * sigma;
	} // end FUNCTION kde_estimator_silverman

	/**
	* FUNCTION: stdev( vector )
	*	Calculates the sample standard deviation of an input vector.
	*
	* @param {array} vector - 1d array of numeric values
	* @returns {number} standard deviation
	*/
	function stdev( vector ) {
		var sum = 0, sum_of_squares = 0,
			value1, value2,
			N = vector.length;
		for ( var i = 0; i < N; i++ ) {
			sum += vector[ i ];
			sum_of_squares += vector[ i ]*vector[ i ];
		}
		value1 = sum_of_squares / ( N-1 );
		value2 = sum*sum / ( N*(N-1) );
		return Math.sqrt( value1 - value2 );
	} // end FUNCTION stdev()


	// KDE //

	var KDE = function() {

		this._kernel = pdf.normal( 0, 1 ); // standard normal
		this._config = {
			'domain': {
				'min': 0,
				'max': 1,
				'pts': Math.pow( 2, 8 ) // 2^8 = 256
			},
			'bandwidth': [ 1.06 ] // Silverman's Rule of Thumb (n=1,sigma=1)
		};

		return this;
	};

	/**
	* METHOD: kernel( fcn )
	*	KDE kernel setter and getter. If a kernel is provided, sets the instance kernel. If no kernel is provided, returns the instance kernel.
	*
	* @param {function} fcn - probability density function serving as the KDE kernel
	* @returns {object|function} instance object or instance kernel
	*/
	KDE.prototype.kernel = function( fcn ) {
		if ( !arguments.length ) {
			return this._kernel;
		}
		this._kernel = fcn;
		return this;
	}; // end METHOD kernel()

	/**
	* METHOD: bandwidth( value )
	*	KDE bandwidth setter and getter. If a value is provided, sets the instance bandwidth. If no value is provided, returns the instance bandwidth.
	*
	* @param {number} value - desired instance bandwidth
	* @returns {object|number} instance object or instance bandwidth
	*/
	KDE.prototype.bandwidth = function( value ) {
		if ( !arguments.length ) {
			return this._config.bandwidth;
		}
		this._config.bandwidth = value;
		return this;
	}; // end METHOD bandwidth()

	/**
	* METHOD: estimator( data, method )
	*	Computes bandwidth estimates from input data. NOTE: the estimates will override the current bandwidth value.
	*
	* @param {array} data - 1d array over which to calculate a bandwidth estimator
	* @param {string} method - estimator method; methods include: Silverman.
	* @returns {object} instance object
	*/
	KDE.prototype.estimator = function( data, method ) {
		var methods = {
				'silverman': kde_estimator_silverman
			};

		if ( arguments.length !== 2 ) {
			throw new Error( 'estimator()::incorrect number of input arguments. Provide data and an estimator method.' );
		}

		method = method.toLowerCase();

		if ( !methods.hasOwnProperty( method ) ) {
			throw new Error( 'estimator()::unrecognized estimator method: ' + method );
		}

		this._config.bandwidth = methods[ method ]( data );

		return this;
	}; // end METHOD estimator()

	/**
	* METHOD: min( value )
	*	Domain min setter and getter. If a value is supplied, defines the instance domain min. If no value is supplied, returns the instance domain min.
	*
	* @param {number} min - desired instance domain min.
	* @returns {object|number} instance object or instance domain min.
	*/
	KDE.prototype.min = function( value ) {
		var domain = this._config.domain;
		if ( !arguments.length ) {
			return domain.min;
		}
		domain.min = value;
		return this;
	}; // end METHOD min()

	/**
	* METHOD: max( value )
	*	Domain max setter and getter. If a value is supplied, defines the instance domain max. If no value is supplied, returns the instance domain max.
	*
	* @param {number} max - desired instance domain max.
	* @returns {object|number} instance object or instance domain max.
	*/
	KDE.prototype.max = function( value ) {
		var domain = this._config.domain;
		if ( !arguments.length ) {
			return domain.max;
		}
		domain.max = value;
		return this;
	}; // end METHOD max()

	/**
	* METHOD: domain( arr )
	*	Domain setter and getter. If an array is supplied, sets the instance domain. If no argument is supplied, gets the instance domain.
	*
	* @param {array} arr - 2-element array defining the domain
	* @returns {object|array} instance object or domain
	*/
	KDE.prototype.domain = function( arr ) {
		var domain = this._config.domain;

		if ( !arguments.length ) {
			return [ domain.min, domain.max ];
		}
		domain.min = arr[ 0 ];
		domain.max = arr[ 1 ];
		
		return this;
	}; // end METHOD domain()

	/**
	* METHOD: points( value )
	*	Number of points along the KDE domain setter and getter. If a value is supplied, defines the number of points on the instance domain. If no value is supplied, returns the number of points on the instance domain. Note: the number of points should be a power of 2. If not a power of 2, pts = 2^ceil(log2(pts)).
	*
	* @param {number} value - desired number of points on the KDE domain.
	* @returns {object|number} instance object or number of points.
	*/
	KDE.prototype.points = function( value ) {
		var domain = this._config.domain,
			power;

		if ( !arguments.length ) {
			return domain.pts;
		}
		power = Math.ceil( Math.log( value ) / Math.log( 2 ) );
		domain.pts = Math.pow( 2, power );
		
		return this;
	}; // end METHOD points()

	// TODO: use dfft to speed KDE calculation.

	/**
	* METHOD: eval( data )
	*	Computes the kernel density estimate.
	*
	* @param {array} data - array of arrays where each nested array is a dataset over which to calculate a KDE
	* @returns {array} array of arrays where each nested array is the KDE for a dataset. Note: the output datasets are NOT guaranteed to be the same length as the input datasets. Density length depends on the number of mesh points over which the density is evaluated.
	*/
	KDE.prototype.eval = function( data ) {
		var density = [], val,
			pdf = this._kernel,
			bw = this._config.bandwidth,
			N = this._config.domain.pts,
			min = this._config.domain.min,
			max = this._config.domain.max,
			edges, interval;

		// Create a sampling vector:
		interval = (max-min) / (N-1);
		edges = linspace( min, max, interval );

		// Initialize the density array:
		density = new Array( N );

		// Compute a density estimate:
		for ( var n = 0; n < N; n++ ) {

			// Initialize the density to zero for this interval point:
			density[ n ] = [ edges[n], 0 ];

			// Given a sampling vector, build the density by evaluating the PDF for each datum and summing:
			for ( var i = 0; i < data.length; i++ ) {
				val = ( data[i] - edges[n] ) / bw;
				density[ n ][ 1 ] += pdf( val );
			}
			density[ n ][ 1 ] /= ( bw * N );

		} // end FOR j

		return density;
	}; // end METHOD eval()


	// EXPORTS //

	module.exports = KDE;

})();

