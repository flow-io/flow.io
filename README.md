Flow.io
==========

Collection of Node.js streams.


## Installation

``` bash
$ npm install flow.io
```

## Usage

To use flow,

``` javascript
var flow = require( 'flow.io' );
```

The _flow_ module includes the following streams...


### flow.read()

This creates a file readStream factory. 

``` javascript
var rStream = flow.read();
```

You configure the stream factory by specifying a filepath:

``` javascript
rStream.path( 'path/to/file' );
```

Once specified, create a new readStream:

``` javascript
var stream = rStream.stream( clbk );
```

Where the `clbk` is invoked upon stream `end` and has an `error` as its first argument. If no read errors, `error` is `null`.

Methods are chainable:

``` javascript
flow.read()
	.path( 'path/to/file' )
	.stream( clbk )
	.pipe( process.stdout );
```


---
## Streams

If you are interested in rolling your own set of streams, see the following modules...


### Files

*	[flow-read](https://github.com/flow-io/flow-read)
*	[flow-write](https://github.com/flow-io/flow-write)


### JSON

*	[flow-parse](https://github.com/flow-io/flow-parse)
*	[flow-stringify](https://github.com/flow-io/flow-stringify)


### Arrays

* 	[flow-array](https://github.com/flow-io/flow-array)


### Map

*	[flow-map](https://github.com/flow-io/flow-map)


### Reduce

*	[flow-reduce](https://github.com/flow-io/flow-reduce)


### Statistics

*	[flow-count](https://github.com/flow-io/flow-count)
*	[flow-covariance](https://github.com/flow-io/flow-covariance)
*	[flow-histc](https://github.com/flow-io/flow-histc)
*	[flow-iqr](https://github.com/flow-io/flow-iqr)
*	[flow-max](https://github.com/flow-io/flow-max)
*	[flow-mean](https://github.com/flow-io/flow-mean)
*	[flow-mmean](https://github.com/flow-io/flow-mmean)
*	[flow-median](https://github.com/flow-io/flow-median)
*	[flow-min](https://github.com/flow-io/flow-min)
*	[flow-pcc](https://github.com/flow-io/flow-pcc)
*	[flow-quantiles](https://github.com/flow-io/flow-quantiles)
*	[flow-sum](https://github.com/flow-io/flow-sum)
*	[flow-msum](https://github.com/flow-io/flow-msum)
*	[flow-csum](https://github.com/flow-io/flow-csum)
*	[flow-variance](https://github.com/flow-io/flow-variance)


### Filters

*	[flow-find](https://github.com/flow-io/flow-find)
*	[flow-nans](https://github.com/flow-io/flow-nans)




---
## Tests

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions.

Assuming you have installed Mocha, execute the following command in the top-level application directory to run the tests:

``` bash
$ mocha
```

All new feature development should have corresponding unit tests to validate correct functionality.


---
## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.
