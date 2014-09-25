var flow = require( './../lib' );
var through = require('through');
var readArray = require( 'event-stream' ).readArray;

var stream = flow.chunkify()
  .numValues(2)
  .stream();

readArray(process.argv)
  .pipe(stream)
  .pipe(through(function(val){
    console.log(val);
  }));

