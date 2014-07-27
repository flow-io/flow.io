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

The flow module is comprised of several smaller modules. If you want to roll your own set of stream factories, follow the links and import the individual modules.


## API

The flow module includes the following stream factories...

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

#### [flow-parse()](https://github.com/flow-io/flow-parse)

Transform stream factory to parse JSON.


#### [flow-stringify](https://github.com/flow-io/flow-stringify)

Transform stream factory to stringify JSON.


### Arrays

#### [flow-array](https://github.com/flow-io/flow-array)

Transform stream factory to convert an array into an element-by-element readStream. Useful when using a sink stream which generates an array and where downstream streams require individual data elements. 


### Map

#### [flow-map](https://github.com/flow-io/flow-map)

Transform stream factory to map a data value to another data value via a transformation function.


### Reduce

#### [flow-reduce](https://github.com/flow-io/flow-reduce)

Transform stream factory to perform a data reduction.


### Statistics

#### [flow-count](https://github.com/flow-io/flow-count)

Reduce stream factory to count the number of streamed data elements and stream the result.


#### [flow-covariance](https://github.com/flow-io/flow-covariance)

Reduce stream factory to calculate the covariance between data elements in a numeric data stream.


#### [flow-histc](https://github.com/flow-io/flow-histc)

Reduce stream factory to compute a histogram over a numeric data stream.


#### [flow-iqr](https://github.com/flow-io/flow-iqr)

Reduce stream factory to compute the inter-quartile range from a numeric data.




---
## Streams


### Statistics

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
