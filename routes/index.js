var express = require('express');
const { route } = require('./users');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index1', { title: 'Venture Forth' });
});

// /* GET users listing. */
// router.get('/users', function(req, res, next) {
//   res.render('user-index', { title: 'Venture Forth' });
// });




module.exports = router;

