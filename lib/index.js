/**
*
*	FLOW.IO
*
*
*	DESCRIPTION:
*		- Collection of node.js streams.
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
*		[1] flow modules; e.g., flow-sum, flow-count, ...
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
	flow.read = require( 'flow-read' );
	flow.write = require( 'flow-write' );

	/**
	* JSON streams.
	*/
	flow.parse = require( 'flow-parse' );
	flow.stringify = require( 'flow-stringify' );

	/**
	* Array streams.
	*/
	flow.array = require( 'flow-array' );
	flow.chunkify = require( 'flow-chunkify' );
	flow.sinkandstream = require( 'flow-sink-and-stream' );

	/**
	* Map streams.
	*/
	flow.map = require( 'flow-map' );

	/**
	* Reduce streams.
	*/
	flow.reduce = require( 'flow-reduce' );

	/**
	* Math streams.
	*/
	flow.abs = require( 'flow-abs' );
	flow.round = require( 'flow-round' );
	flow.floor = require( 'flow-floor' );
	flow.ceil = require( 'flow-ceil' );
	flow.add = require( 'flow-add' );
	flow.subtract = require( 'flow-subtract' );
	flow.multiply = require( 'flow-multiply' );
	flow.divide = require( 'flow-divide' );
	flow.pow = require( 'flow-pow' );
	flow.exp = require( 'flow-exp' );
	flow.diff = require( 'flow-diff' );

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
	flow.mmax = require( 'flow-mmax' );
	flow.min = require( 'flow-min' );
	flow.mmin = require( 'flow-mmin' );
	flow.mean = require( 'flow-mean' );
	flow.mmean = require( 'flow-mmean' );
	flow.cmean = require( 'flow-cmean' );
	flow.median = require( 'flow-median' );
	flow.mva = require( './stats/mva' );
	flow.mvariance = require( './stats/mvariance' );
	flow.pcc = require( 'flow-pcc' );
	flow.quantiles = require( 'flow-quantiles' );
	flow.skewness = require( 'flow-skewness' );
	flow.sum = require( 'flow-sum' );
	flow.msum = require( 'flow-msum' );
	flow.csum = require( 'flow-csum' );
	flow.variance = require( 'flow-variance' );

	/**
	* Filter streams.
	*/
	flow.outliers = require( './filter/outliers' );
	flow.mOutliers = require( './filter/outliers/mild.js' );
	flow.eOutliers = require( './filter/outliers/extreme.js' );
	flow.find = require( 'flow-find' );
	flow.nans = require( 'flow-nans' );

	/**
	* Mock streams.
	*/
	flow.mockWrite = require( 'flow-mock-write' );
	flow.mockRead = require( 'flow-mock-read' );


	// EXPORTS //

	module.exports = flow;

})();