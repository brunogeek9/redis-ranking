const express = require('express');
const app = express();
var redis = require('redis');
var client = redis.createClient();
app.listen(3001, function () {
    console.log('escutando sempre a porta 3001!');
      client.on('connect', () => {
        console.log('REDIS is ok');
    });
});

app.get('/addscore/:name&:sc', function (req, res) {
    var name = req.params.name;
    var score = req.params.sc;
    res.send(`adicionando ${score} ao jogador ${name}`);
    var args = [ 'players', 'incr',score, name];
    client.zadd(args, function (err, response) {
        if (err) throw err;
        console.log('added the pontuation '+response+' items.');
    });


    
});

app.get('/top10', function (req, res) {
    let args = [ 'players', '+inf', '-inf'];
    client.zrevrangebyscore(args, function (err, response) {
        if (err) throw err;
        console.log('top10', response);
        // write your code here
    });
    res.send(`top 10 jogadores`);
});

app.get('/rank/:num', function (req, res) {
    var num = req.params.num;
    res.send(`jogador numero ${num}`);
});

// zrange pl -10 -1