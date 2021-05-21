
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
const MAPS = "map";

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

async function post_Map(name, map){
  console.log("send to DB");
  var key = datastore.key(MAPS);
  const newMap = {"name": name, "map": map};
  // const new_Layer = {"name": name, "map": map, user : user};
  await datastore.save({ "key": key, "data": newMap});
  return key;
}

async function get_Maps(){
  const q = datastore.createQuery(MAPS);
  const entities = await datastore.runQuery(q);
  return entities[0].map(fromDatastore);
}

async function get_Map(key){
  const data = await datastore.get(key);
  return data;
};



/* --- Datastore API calls ---*/

mainRouter.post('/map', function(req, res){
  console.log("inside post")
  post_Map(req.body.name, req.body.map)
  .then(key =>{
    let reString = {
      "id" : key.id,
      "name" : req.body.name,
      "nam" : req.body.map
    }
    console.log(reString)
    res.status(201).send(reString);
  })
});

mainRouter.get('/map', function(req, res){
  const layer = get_Maps()
.then( (layer) => {
      res.status(200).json(layer);
  });
});

mainRouter.get('/map/:id', function(req, res){
  console.log("Inside get MAP ID") 
  const key = datastore.key([MAPS, parseInt(req.params.id, 10)]);
  
  get_Map(key).then(map => {
      console.log("Found Map");
      console.log(map);
      if(map[0]){
          console.log(map);
          res.status(200).send(map[0]);

      }else {
          console.log("No id found");
          let erString = {"Error": "No map with this boat_id exists"};
          res.status(404).send(erString);
      }
  })}
);



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
