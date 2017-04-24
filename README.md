Flow.io
=======
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependencies][dependencies-image]][dependencies-url]

> Collection of Node.js streams.


## Installation

``` bash
$ npm install flow.io
```

## Usage

To use flow,

``` javascript
var flow = require( 'flow.io' );
```

The flow library is comprised of several smaller modules. If you want to roll your own flow, follow the links and import the individual modules.

The flow library includes the following stream factories...

### Files

#### [flow.read()](https://github.com/flow-io/flow-read)

File readStream factory.

``` javascript
var stream = flow.read()
	.path( 'path/to/file' )
	.stream( clbk );

stream.pipe( process.stdout );
```


#### [flow.write()](https://github.com/flow-io/flow-write)

File writeStream factory.

``` javascript
var stream = flow.write()
	.path( 'path/to/destination' )
	.stream( clbk );

readStream.pipe( stream );
```


### JSON

#### [flow.parse()](https://github.com/flow-io/flow-parse)

Transform stream factory to parse JSON. Wraps JSONStream's [parse](https://github.com/dominictarr/JSONStream) stream.

``` javascript
var rStream = flow.read()
	.path( 'path/to/file.json' )
	.stream();

var pStream = flow.parse().stream();

rStream
	.pipe( pStream )
	.pipe( /* writable stream*/ );
```


#### [flow.stringify()](https://github.com/flow-io/flow-stringify)

Transform stream factory to stringify JSON. Wraps JSONStream's [stringify](https://github.com/dominictarr/JSONStream) stream.

``` javascript
var rStream = flow.read()
	.path( 'path/to/file.json' )
	.stream();

var pStream = flow.parse().stream();

var sStream = flow.stringify().stream();

var wStream = flow.write()
	.path( 'path/to/destination.json' )
	.stream();

rStream
	.pipe( pStream )
	.pipe( sStream )
	.pipe( wStream );
```


### Arrays

#### [flow.array()](https://github.com/flow-io/flow-array)

Transform stream factory to convert an array into an element-by-element readable stream. Similar to event-stream [readArray](https://github.com/dominictarr/event-stream#readarray-array), except a transform stream. Useful when using a sink stream which generates an array and where downstream streams in a stream pipeline require individual data elements. 

#### [flow.chunkify()](https://github.com/flow-io/flow-chunkify)

Transform stream factory to chunk streamed data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 1, 1, 1, 2, 2, 2, 3, 3, 3 ] );

var stream = flow.chunkify()
	.numValues( 3 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


#### [flow.sinkandstream()](https://github.com/flow-io/flow-sink-and-stream)

Transform stream factory to sink a specified number of streamed data values and then stream new data values as they arrive. 

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 1, 1, 1, 2, 3, 4, 5 ] );

var stream = flow.sinkandstream()
	.numValues( 3 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


### Map

#### [flow.map()](https://github.com/flow-io/flow-map)

Transform stream factory to map a data value to another data value via a transformation function. Wraps event-stream's [map](https://github.com/dominictarr/event-stream#map-asyncfunction) stream.


### Reduce

#### [flow.reduce()](https://github.com/flow-io/flow-reduce)

Transform stream factory to perform a data reduction.



### Mathematics

#### [flow.abs()](https://github.com/flow-io/flow-abs)

Transform stream factory to map numeric data stream values to their absolute values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ -1, -1, 0, 1, 1 ] );

var stream = flow.abs().stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```

#### [flow.round()](https://github.com/flow-io/flow-round)

Transform stream factory to round numeric data stream values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 3.245, -0.9845, -20.446, 0.5, 1.0, 10 ] );

var stream = flow.round().stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```



#### [flow.floor()](https://github.com/flow-io/flow-floor)

Transform stream factory to floor numeric data stream values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 3.245, -0.9845, -20.446, 0.5, 1.0, 10, 5.9999 ] );

var stream = flow.floor().stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```



#### [flow.ceil()](https://github.com/flow-io/flow-ceil)

Transform stream factory to round numeric data stream values toward positive infinity.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 3.245, -0.9845, -20.446, 0.5, 1.0, 10, 5.9999 ] );

var stream = flow.ceil().stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


#### [flow.add()](https://github.com/flow-io/flow-add)

Transform stream factory to increment streamed numeric data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 1, 0, 1, 1, 0 ] );

var stream = flow.add()
	.add( 100 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


#### [flow.subtract()](https://github.com/flow-io/flow-subtract)

Transform stream factory to decrement streamed numeric data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 1, 0, 1, 1, 0 ] );

var stream = flow.subtract()
	.subtract( 1 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```



#### [flow.multiply()](https://github.com/flow-io/flow-multiply)

Transform stream factory to perform scalar multiplication on streamed numeric data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 12, 8, 34, 512, 72 ] );

var stream = flow.multiply()
	.scalar( 10 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```

#### [flow.divide()](https://github.com/flow-io/flow-divide)

Transform stream factory to perform scalar division on streamed numeric data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 12, 8, 34, 512, 72 ] );

var stream = flow.divide()
	.divisor( 10 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


#### [flow.pow()](https://github.com/flow-io/flow-pow)

Transform stream factory to exponentiate numeric data stream values according to a specified power.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 2, 4, 3, 5, 7 ] );

var stream = flow.pow()
	.exponent( 3 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


#### [flow.exp()](https://github.com/flow-io/flow-exp)

Transform stream factory to evaluate an exponential function for each numeric data value.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 1.453, 0, 9.504, 102.2, 1 ] );

var stream = flow.exp().stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


#### [flow.diff()](https://github.com/flow-io/flow-diff)

Transform stream factory to calculate the difference between successive streamed data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 10, 8, 22, 100, 1 ] );

var stream = flow.diff().stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream */ );
```


### Statistics

#### [flow.count()](https://github.com/flow-io/flow-count)

Reduce stream factory to count the number of streamed data elements and stream the result.


#### [flow.min()](https://github.com/flow-io/flow-min)

Reduce stream factory to find a numeric data stream's minimum value.


#### [flow.mmin()](https://github.com/flow-io/flow-mmin)

Transform stream factory to find sliding-window minimum values (moving min) over a numeric data stream.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [1,0,5,2,3,6,8,1,0] );

var stream = flow.mmin()
	.window( 3 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream*/ );
```


#### [flow.max()](https://github.com/flow-io/flow-max)

Reduce stream factory to find a numeric data stream's maximum value.


#### [flow.mmax()](https://github.com/flow-io/flow-mmax)

Transform stream factory to find sliding-window maximum values (moving max) over a numeric data stream.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [1,0,5,2,3,6,8,1,0] );

var stream = flow.mmax()
	.window( 3 )
	.stream();

readStream
	.pipe( stream )
	.pipe( /* writable stream*/ );
```


#### [flow.sum()](https://github.com/flow-io/flow-sum)

Reduce stream factory to calculate a numeric data stream's sum.


#### [flow.msum()](https://github.com/flow-io/flow-msum)

Transform stream factory to compute a sliding-window sum over a numeric data stream.


#### [flow.csum()](https://github.com/flow-io/flow-csum)

Transform stream factory to compute the cumulative sum over a numeric data stream.


#### [flow.median()](https://github.com/flow-io/flow-median)

Reduce stream factory to find a numeric data stream's median value.


#### [flow.quantiles()](https://github.com/flow-io/flow-quantiles)

Reduce stream factory to compute quantiles from a numeric data stream.


#### [flow.iqr()](https://github.com/flow-io/flow-iqr)

Reduce stream factory to compute the inter-quartile range from a numeric data.


#### [flow.histc()](https://github.com/flow-io/flow-histc)

Reduce stream factory to compute a histogram over a numeric data stream.


#### [flow.mean()](https://github.com/flow-io/flow-mean)

Reduce stream factory to calculate a numeric data stream's mean.


#### [flow.mmean()](https://github.com/flow-io/flow-mmean)

Transform stream factory to compute a sliding-window average over a numeric data stream.


#### [flow.cmean()](https://github.com/flow-io/flow-cmean)

Transform stream factory to calculate arithmetic means for streamed data arrays (chunks).

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 1, 2, 1, 2, 2, 1, 4, 3, 5.5 ] );

var cStream = flow.chunkify()
	.numValues( 3 )
	.stream();

var mStream = flow.cmean()
	.stream();

readStream
	.pipe( cStream )
	.pipe( mStream )
	.pipe( /* writable stream */ );
```


#### [flow.variance()](https://github.com/flow-io/flow-variance)

Reduce stream factory to calculate a numeric data stream's variance.


#### [flow.covariance()](https://github.com/flow-io/flow-covariance)

Reduce stream factory to calculate the covariance between data elements in a numeric data stream.


#### [flow.pcc()](https://github.com/flow-io/flow-pcc)

Reduce stream factory to compute the Pearson product-moment correlation coefficient between data elements in a numeric data stream.


#### [flow.skewness()](https://github.com/flow-io/flow-skewness)

Reduce stream factory to calculate the sample skewness of streamed data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 82, 34, 45, 56, 56, 71 ] );

var sStream = flow.skewness().stream();

readStream
	.pipe( sStream )
	.pipe( /* writable stream */ );
```


#### [flow.kurtosis()](https://github.com/flow-io/flow-kurtosis)

Reduce stream factory to calculate the sample excess kurtosis of streamed data values.

``` javascript
var readArray = require( 'event-stream' ).readArray;

var readStream = readArray( [ 82, 34, 45, 56, 56, 71 ] );

var kStream = flow.kurtosis().stream();

readStream
	.pipe( kStream )
	.pipe( /* writable stream */ );
```



### Filters

#### [flow.find()](https://github.com/flow-io/flow-find)

Filter stream factory which finds stream values matching user-defined criteria.


#### [flow.nans()](https://github.com/flow-io/flow-nans)

Filter stream factory which removes any stream values which are not numeric.



### Mock

#### [flow.mockWrite()](https://github.com/flow-io/flow-mock-write)

Provides a mock source for writable streams.

Note: implemented as a [classic stream](classic stream).

``` javascript
var eventStream = require( 'event-stream' );

// Simulate some data:
var data = new Array( 100 );

for ( var i = 0; i < data.length; i++ ) {
    data[ i ] = Math.random()*100;
}

// Create a writable stream:
var writable = eventStream.map( function( d, clbk ){
        clbk( null, d.toString()+'\n' );
    });

// Pipe to standard out:
writable.pipe( process.stdout );

// Start streaming...
mock( data, writable );
```


#### [flow.mockRead()](https://github.com/flow-io/flow-mock-read)

Provides a mock stream sink for readable streams.

Note: implemented as a [classic stream](classic stream).

``` javascript
var eventStream = require( 'event-stream' );

// Simulate some data:
var data = new Array( 100 );

for ( var i = 0; i < data.length; i++ ) {
    data[ i ] = Math.random()*100;
}

// Create a readable stream:
var readStream = eventStream.readArray( data );

// Start streaming...
mock( readStream, onEnd );

function onEnd( error, data ) {
    console.log( JSON.stringify( data ) );
}
```



---
## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ open reports/coverage/lcov-report/index.html
```


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/flow.io.svg
[npm-url]: https://npmjs.org/package/flow.io

[travis-image]: http://img.shields.io/travis/flow-io/flow.io/master.svg
[travis-url]: https://travis-ci.org/flow-io/flow.io

[coveralls-image]: https://img.shields.io/coveralls/flow-io/flow.io/master.svg
[coveralls-url]: https://coveralls.io/r/flow-io/flow.io?branch=master

[dependencies-image]: http://img.shields.io/david/flow-io/flow.io.svg
[dependencies-url]: https://david-dm.org/flow-io/flow.io

[dev-dependencies-image]: http://img.shields.io/david/dev/flow-io/flow.io.svg
[dev-dependencies-url]: https://david-dm.org/dev/flow-io/flow.io

[github-issues-image]: http://img.shields.io/github/issues/flow-io/flow.io.svg
[github-issues-url]: https://github.com/flow-io/flow.io/issues
