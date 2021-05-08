
const axios = require('axios');
var map;

var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var cors = require('cors');



var mainRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());

//States for layers
mapState = [];
tokenState = [];


// view engine setup
app.engine('hbs',hbs({
  extname: 'hbs',
  defaultLayout: 'layout1', // MODIFIED FOR TESTING
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir : [
    path.join(__dirname, 'views/partials')
  ]
}));
app.set('views', path.join(__dirname, 'views/layouts'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// //Set cookie to random number
// app.use(function (req, res, next){
//   var cookie = req.cookies.cookieName;
//   if (cookie == undefined){
//     //If no cookie exists, we need to set one
//     var randomNumber = Math.random().toString();
//     randomNumber = randomNumber.substring(2, randomNumber.length);
//     res.cookie('cookieName', randomNumber, {maxAge: 900000, httpOnly: true});
//     console.log('cookie created successfully');
//   } else {
//     //cookie was already present
//     console.log('cookie exists', cookie);
//   }
//   next();

// });
function genuuid(){
  var randomNumber = Math.random().toString();
  randomNumber = randomNumber.substring(2, randomNumber.length);
  return randomNumber;
}

const sessionMiddleware = session({genid: function(req) {
  return genuuid();
}, secret: "venture-forth", resave:true, saveUninitialized: true, cookie :{maxAge: 900000}});
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter); // USE THIS ROUTER FOR CALLS TO AND FROM CLIETNT SIDE SCRIPTS
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


mainRouter.post('/tokenState', (req, res) =>{
  tokenState = req.body.payload;
  console.log(tokenState);
  res.status(200).send("Captured Map and stored");
})

mainRouter.get('/tokenState', (req, res) =>{
  console.log("in map state get");
  context = {};
  context.curTokenState = tokenState;
  res.status(200).send(context);
  //res.end(curState);
})

mainRouter.post('/mapState', (req, res) =>{
  mapState = [];
  mapState = req.body.payload.curMapState;
  console.log(mapState);
  res.status(200).send("Captured Map and stored");
})

mainRouter.get('/mapState', (req, res) =>{
  console.log("in map state load");
  context = {};
  context.curMapState = mapState;
  res.status(200).send(context);
  //res.end(curState);
})



// mainRouter.post('/setAxis', (req, res) =>{
//   context = {};
//   context.xAxis =
// })

// Endpoint where client Side Stage is being Sent
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
