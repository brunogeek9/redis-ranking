const express = require('express');
const app = express();
var redis = require('redis');
var client = redis.createClient();
var _=require('underscore');

app.listen(3001, function () {
    console.log('escutando sempre a porta 3001!');
      client.on('connect', () => {
        console.log('REDIS is ok');
    });
});

app.get('/addscore/:name&:sc', function (req, res) {
    var name = req.params.name;
    var score = req.params.sc;
    
    var args = [ 'players', 'incr',score, name];
    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('added the pontuation '+response+' items.');
        res.send(`adicionando ${score} ao jogador ${name}`);
    });    
});

app.get('/rmscore/:name&:sc', function (req, res) {
    var name = req.params.name;
    var score = req.params.sc;
    var rm = score * -1;
    var args = [ 'players', 'incr',rm, name];
    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('removed the pontuation '+response+' items.');
        res.send(`removendo ${score} pontos do jogador ${name}`);
    });    
});

app.get('/top10', function (req, res) {
    
    client.zrange('players', -10, -1, 'withscores', function(err, members) {
        
        var rev = members.reverse(); 
        var lists=_.groupBy(rev, function(a,b) {
            return Math.floor(b/2);
        });
        
        console.log( _.toArray(lists) );
        res.json(lists)
    });

    // ;
});

app.get('/rank/:num', function (req, res) {
    var pos = req.params.num * -1;
    client.zrange('players', pos, pos, 'withscores', function(err, members) { 
        console.log(members);
        res.json(_.toArray(members))
    });
});

// zrange pl -10 -1