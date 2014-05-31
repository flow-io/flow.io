/**
*
*	FLOW.IO
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
*		- 2014/05/30: Created. [AReines].
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

	// FLOW //

	var flow = {};


	// STREAMS //

	/**
	* File streams.
	*/
	flow.read = require( './streams/file/read.js' );
	flow.write = require( './streams/file/write.js' );

	/**
	* JSON streams.
	*/
	flow.parse = require( './streams/json/parse.js' );
	flow.stringify = require( './streams/json/stringify.js' );

	/**
	* Reduce streams.
	*/
	flow.reduce = require( './streams/reduce' );

	/**
	* Transform streams.
	*/
	flow.transform = require( './streams/transform' );

	/**
	* Statistics streams.
	*/
	flow.count = require( './streams/stats/count' );
	flow.histc = require( './streams/stats/histc' );
	flow.kde = require( './streams/stats/kde' );
	flow.kurtosis = require( './streams/stats/kurtosis' );
	flow.max = require( './streams/stats/max' );
	flow.mean = require( './streams/stats/mean' );
	flow.median = require( './streams/stats/median' );
	flow.min = require( './streams/stats/min' );
	flow.mmean = require( './streams/stats/mmean' );
	flow.mva = require( './streams/stats/mva' );
	flow.mvariance = require( './streams/stats/mvariance' );
	flow.quantiles = require( './streams/stats/quantiles' );
	flow.skewness = require( './streams/stats/skewness' );
	flow.sum = require( './streams/stats/sum' );
	flow.variance = require( './streams/stats/variance' );


	// EXPORTS //

	module.exports = flow;

})();