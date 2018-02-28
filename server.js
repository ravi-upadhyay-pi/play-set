
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    app = express(),
    router = express.Router(),
    compress = require('compression'),
    http = require('http');

var api = require('./api/puzzle');

// making port binding dynamic
app.set('port', process.env.PORT || 5858)
// make the server gzip enabled
app.use(compress());
// serves favicon (is it static?) 
app.use(favicon(__dirname + '/public/favicon.ico'));
// logs all the call coming on server
app.use(logger('dev'));
// to parse body of request
app.use(bodyParser.json());
// "/api" from the url will be consumed in the next call
// if url doesn't have "/api", then it is assumed to be 
// a call for static elements
app.use('/api', api);
// to serve static assets of server
app.use(express.static('public'));

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
})