var flow = require( './../lib' );

var through = require('through');
var split = require('split');

var file = process.argv[2];
if(!file) return;

flow.read().path(file).stream()
  .pipe(split())
  .pipe(flow.count().stream())
  .pipe(through(function(count){
    console.log(count);
  }));
