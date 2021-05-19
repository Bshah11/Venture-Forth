
const axios = require('axios');
var map;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars');
var cors = require('cors');


var mainRouter = require('./routes/index');
var dmRouter = require('./routes/dm');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());


// DB setup Google Cloud Storage
const {Datastore} = require('@google-cloud/datastore');
const bodyParser = require('body-parser');
const datastore = new Datastore();
const LAYERS = "layers";

function fromDatastore(item){
  item.id = item[Datastore.KEY].id;
  return item;
}

function toDatastore (obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}

/* --- Layer  model Functions ---- */

async function post_layer(name, layer){
  console.log("send to DB");
  var key = datastore.key(LAYERS);
  const new_Layer = {"name": name, "layer": layer};
  // const new_Layer = {"name": name, "map": map, user : user};
  await datastore.save({ "key": key, "data": new_Layer});
  return key;
}

async function get_layer(){
  const q = datastore.createQuery(LAYERS);
  const entities = await datastore.runQuery(q);
  return entities[0].map(fromDatastore);
}



/* --- Datastore API calls ---*/

mainRouter.post('/layers', function(req, res){
  console.log("inside post")
  post_layer(req.body.name, req.body.layer)
  .then(key =>{
    let reString = {
      "id" : key.id,
      "name" : req.body.name,
      "layer" : req.body.layer
    }
    console.log(reString)
    res.status(201).send(reString);
  })
});

mainRouter.get('/layers', function(req, res){
  const layer = get_layer()
.then( (layer) => {
      res.status(200).json(layer);
  });
});


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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRouter); // USE THIS ROUTER FOR CALLS TO AND FROM CLIETNT SIDE SCRIPTS
app.use('/dm', dmRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



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
