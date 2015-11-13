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
	};
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
	};
}

function gererErreur(err, res) {
	console.log(err);
	res.send('erreur serveur');
	return ;
}

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Let\'s go',
		query: req.query.query
	});
});

router.get('/update/init', function(req, res, next) {
	fs.readFile('./public/ressources/livre.json', 'utf8', function(err, data) {
		if (err) {
			return gererErreur(err, res);
		}
		data = JSON.parse(data);
		var sort = data.config;
		
		_.each(data.livre, function(element, index, list) {
			element.id = index + 1;
		});
		
		res.charset = 'utf8';
		res.set('Content-Type', 'text/json');
		res.send(data);
	});
});

router.post('/update', function(req, res, next) {
	console.log('dans update');
	fs.readFile('./public/ressources/livre.json', 'utf8', function(err, data) {
		if (err) {
			return gererErreur(err, res);
		}
		console.log('lecture du fichier avece success');
		data = JSON.parse(data);
		console.log('debut du tri');
		data.livre = data.livre.sort(function(a, b) {
			return a.id - b.id;
		});
		console.log('tri terminé');
		
		_.each(req.body, function (element, index, list) {
			data.livre[list.id - 1][index] = list[index];
		});
		console.log('modification des données');
		
		fs.writeFile("./public/ressources/livre.json", JSON.stringify(data), 'utf8', function(err) {
			console.log('écriture des résultats');
		    if(err) {
		        return console.log(err);
		    }
		    res.set('Content-Type', 'text/html');
		    res.send();
		}); 
	});
});

router.get('/search', function(req, res, next) {
	var queryParam = req.query.q || '';
	var sortParam = req.query.s || '';
	
	fs.readFile('./public/ressources/livre.json', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		data = JSON.parse(data);
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
