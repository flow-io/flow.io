/**
*
*	HISTC: bin search
*
*
*
*	DESCRIPTION:
*		- Performs a modified binary search to find the appropriate 'bin'.
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
*		- 2014/05/07: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		
*
*	Copyright (c) Athan Reines. 2014.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*
*/

(function() {
	'use strict';

	/**
	* FUNCTION: binsearch( vector, value )
	*	This is a variation of the binary search algorithm, in which we are not seeking equality, per se, but to find that index at which the supplied value equals or exceeds the value at that index but is less than the value at the next index. We are looking for the right 'bin'.
	*
	* @param {array} vector - 1d array defining bin edges
	* @param {number} value - value to bin
	* @returns {number} bin index
	*/
	function binsearch( vector, value ) {
		var lower = 0,
			upper = vector.length,
			id;

		if ( arguments.length !== 2 ) {
			throw new Error( 'binsearch()::invalid input arguments. Function requires two input arguments: 1d array over which to perform the bin search and a value for which to search.' );
		}
		if ( !Array.isArray( vector ) ) {
			throw new Error( 'binsearch()::invalid input argument. Bin vector must be a 1d array.' );
		}
		if ( typeof value !== 'number' || value !== value ) {
			throw new Error( 'binsearch()::invalid input argument. Value must be numeric.' );
		}

		// Initial checks:
		if ( value < vector[ lower ] ) {
			// Value is below the lower bound:
			return -1;
		} // end IF
		if ( value > vector[ upper-1 ] ) {
			//  Value exceeds the upper bound:
			return upper-1;
		} // end IF

		// We know that the value resides somewhere within our vector...okay to proceed...

		while ( lower <= upper ) {
			// Use a bitwise operator to return: Math.floor( (lower + upper) / 2), which is the middle value:
			id = ( lower + upper ) >> 1;

			// Adjust the bounds...
			if ( value > vector[ id ] ) {
				// If the value is greater than the midpoint, increase our lower bound index:
				lower = id + 1;
			} else if ( value < vector[ id ] ) {
				// If the value is less than the midpoint, decrease our upper bound index:
				upper = id - 1;
			} else {
				// If the value equals the midpoint, we have found our index and can exit the loop:
				upper = -2;
			}
		} // end WHILE ()

		// If the value is less than the value at the upper bound index, we want the previous id. Otherwise, we have found our id.
		return ( value < vector[id] ) ? id-1 : id;

	} // end FUNCTION binsearch()


	// EXPORTS //

	module.exports = binsearch;

})();