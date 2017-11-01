var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/', index);

//websocket用例
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ port:8181 });
var params = {
  'zzf':18,
  'fmk':20
};

wss.on('connection',function(ws){
  console.log('client connected');
  //接收客户端请求参数
  function sendStockUpdates(ws){
    ws.send(JSON.stringify(Math.random()*100));
  };
  setInterval(function () {
    sendStockUpdates(ws);
  }, 3000);

  ws.on('message',function(message){
    if(message=='给我数据'){
      sendStockUpdates(ws);
    }
  });

  ws.on('close', function () {
    if (typeof clientStockUpdater !== 'undefined') {
        clearInterval(clientStockUpdater);
    }
  });
});


// app.get('/websock', function (req, res) {
//   var data = {
//     title:'作品列表集',
//     mines:'dsafdafda'
//   };
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain;charset=utf-8');
//   res.end(JSON.stringify(data));
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
