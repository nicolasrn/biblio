var express = require('express');
var router = express.Router();

var fs = require('fs');
var _ = require("underscore");

function normalSort(champ, ordre) {
	return function(a, b) {
		var retour = null;
		if (a[champ] == b[champ])
			return 0;
		if (a[champ] > b[champ]) {
			retour = 1;
		} else {
			retour = -1;
		}
		return retour * ordre; 
	}
}

function naturalSort (champ, ordre) {
	return function naturalSort2(as, bs){
		var rx=/(\d+)|(\D+)/g, rd=/\d+/;
	    var a= String(as[champ]).toLowerCase().match(rx);
	    var b= String(bs[champ]).toLowerCase().match(rx);
	    var retour = null;
	    while(a.length && b.length){
	        var a1= a.shift();
	        var b1= b.shift();
	        if(rd.test(a1) || rd.test(b1)){
	            if(!rd.test(a1)) return 1 * ordre;
	            if(!rd.test(b1)) return -1 * ordre;
	            if(a1!= b1) return (a1 - b1) * ordre;
	        }
	        else if(a1!= b1) return a1 > b1 ? 1 : -1 * ordre;
	    }
	    return (a.length- b.length) * ordre;
	}
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Let\'s go',
		query: req.query.query
	});
});

router.get('/search', function(req, res, next) {
	var queryParam = req.query.q || '';
	var sortParam = req.query.s || '';
	
	fs.readFile('./public/ressources/livre.json', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		var data = JSON.parse(data);
		var sort = data.config;
		
		data = _.filter(data.livre, function (item) {
			var stringify = JSON.stringify(item);
			return stringify.indexOf(queryParam) > -1;
		});
		
		if (sortParam) {
			sortParam = sortParam.split(',');
			var champ = sortParam[0];
			var ordre = sortParam[1] == 'down' ? -1 : 1;
			
			data = data.sort(function(champ, ordre, sort) {
				if (sort[champ] == 'normalSort') {
					return normalSort(champ, ordre);
				} else if (sort[champ] == 'naturalSort') {
					return naturalSort(champ, ordre);
				}
			}(champ, ordre, sort));
		}
		
		res.set('Content-Type', 'text/json');
		res.send(data);
	});
});

module.exports = router;
