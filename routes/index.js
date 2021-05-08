var express = require('express');
const { route } = require('./users');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.session.genid);
  res.render('index1', { title: 'Venture Forth' });
});



module.exports = router;

