/**
*
*	STATS: pdf
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

	// PDF //

	var pdf = {
			'version': '0.0.0' // semvar
		};

	/**
	* METHOD: normal( mu, sigma )
	*	Returns a probability density function for a normal distribution with mean 'mu' and standard deviation 'sigma'.
	*
	* @param {number} mu - distribution mean
	* @param {number} sigma - distribution standard deviation
	* @returns {function} probability density function (PDF)
	*/
	pdf.normal = function( mu, sigma ) {
		var pi = Math.PI,
			sqrt = Math.sqrt,
			exp = Math.exp,
			A = 1 / ( sigma * sqrt(2*pi) ),
			B = -1 / ( 2 * sigma*sigma ),
			C;
		/**
		* FUNCTION: normal( x )
		*	Evaluates the probability distribution function for a normal distribution at input value 'x'.
		*
		* @param {number} x - input value
		* @returns {number} evaluated PDF
		*/
		return function normal( x ) {
			C = x - mu;
			return A * exp( B * C * C );
		};

	}; // end METHOD normal()

	// EXPORTS //

	module.exports = pdf;

})();