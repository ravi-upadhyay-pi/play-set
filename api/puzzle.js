var express = require('express'),
	sqlite = require('sqlite3'),
	db = new sqlite.Database('./database/db'),
	router = express.Router(),
	Deck = require('../public/javascripts/Deck.js');
	
	
router.route('/daily')

	// query for the daily puzzle
	.get(function(req, res){
		var dt = new Date();
		var date = dt.getDate() + "/" + (dt.getMonth()+1) + "/" + dt.getFullYear(); 
		db.serialize(function(){
			db.get("SELECT * FROM DAILY WHERE date=?", date, function(err, row){
				if(row == undefined){
					var puzzle = new Deck(12, 1, 20);
					var jpuzzle = JSON.stringify(puzzle);
					var topScores = [];
					var jtopScores = JSON.stringify(topScores);
					db.run("INSERT INTO DAILY(date, puzzle, topScores) VALUES(?, ?, ?)", date, jpuzzle, jtopScores);
					res.send({puzzle: jpuzzle, topScores: jtopScores});
				}
				else{
					res.send({puzzle: row.puzzle, topScores: row.topScores});
				}
			});
		});
	})
	
	// put new record in database
	.put(function(req, res){
		var dt = new Date();
		var date = dt.getDate() + "/" + (dt.getMonth()+1) + "/" + dt.getFullYear(); 
		db.serialize(function(){
			req.body;
			db.run("UPDATE DAILY SET topScores=? WHERE date=?", JSON.stringify(req.body), date);
		});
		res.end();
	});
	
module.exports = router;