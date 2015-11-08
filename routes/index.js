var express = require('express');
var router = express.Router();

var fs = require('fs');
var _ = require("underscore");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title : 'Let\'s go',
		query: req.query.q
	});
});

router.get('/search', function(req, res, next) {
	param = req.query.q;
	fs.readFile('./public/ressources/livre.json', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		data = JSON.parse(data);

		data = _.filter(data, function (item) {
			var stringify = JSON.stringify(item);
			return stringify.indexOf(param) > -1;
		});
		
		res.set('Content-Type', 'text/json');
		res.send(data);
	});
});

module.exports = router;
