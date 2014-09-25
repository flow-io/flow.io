var flow = require( './../lib' );

flow.read().path(__dirname+'/../package.json').stream()
  .pipe(flow.parse().stream())
  .pipe(flow.stringify().stream())
  .pipe(process.stdout);
