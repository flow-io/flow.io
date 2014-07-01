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
	flow.read = require( './file/read.js' );
	flow.write = require( './file/write.js' );

	/**
	* JSON streams.
	*/
	flow.parse = require( './json/parse.js' );
	flow.stringify = require( './json/stringify.js' );

	/**
	* Array streams.
	*/
	flow.array = require( 'flow-array' );

	/**
	* Map streams.
	*/
	flow.map = require( 'flow-map' );

	/**
	* Reduce streams.
	*/
	flow.reduce = require( 'flow-reduce' );

	/**
	* Statistics streams.
	*/
	flow.count = require( 'flow-count' );
	flow.covariance = require( 'flow-covariance' );
	flow.histc = require( 'flow-histc' );
	flow.iqr = require( 'flow-iqr' );
	flow.kde = require( './stats/kde' );
	flow.kurtosis = require( './stats/kurtosis' );
	flow.max = require( 'flow-max' );
	flow.mean = require( 'flow-mean' );
	flow.median = require( 'flow-median' );
	flow.min = require( 'flow-min' );
	flow.mmean = require( './stats/mmean' );
	flow.mva = require( './stats/mva' );
	flow.mvariance = require( './stats/mvariance' );
	flow.pcc = require( './stats/pcc' );
	flow.quantiles = require( 'flow-quantiles' );
	flow.skewness = require( './stats/skewness' );
	flow.sum = require( 'flow-sum' );
	flow.variance = require( 'flow-variance' );

	/**
	* Filter streams.
	*/
	flow.outliers = require( './filter/outliers' );
	flow.mOutliers = require( './filter/outliers/mild.js' );
	flow.eOutliers = require( './filter/outliers/extreme.js' );
	flow.find = require( './find' );
	flow.nans = require( 'flow-nans' );


	// EXPORTS //

	module.exports = flow;

})();