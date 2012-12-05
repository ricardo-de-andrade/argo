var argo = require('../');
var cors = require('./cors');
var tracer = require('../tracer');

var proxy = argo();
var port = process.env.PORT || 3000;

proxy
  .use(function(addHandler) {
    addHandler('request', function(env, next) {
      env.startTime = +Date.now();
      next(env);
    });
  })
  .use(tracer)
  .use(cors)
  .route('/weather/forecasts', require('./forecasts'))
  .use(function(addHandler) {
    addHandler('response', function(env, next) {
      console.log(new Date() + ': Duration (total): ' + (+Date.now() - env.startTime) + 'ms');
      next(env);
    });
  })
  .listen(port);

console.log('Listening on http://localhost:' + port);
