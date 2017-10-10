var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var qs =  require('querystring');
var http = require('http');
var keys = require('./private/keys');

var app = express();
var sid = null ;
var otp = null ;
app.set('port', 4000);
//app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'pug');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

// for balance check
app.get('/', function (req,res) {
    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/BAL/SMS',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        var temp = JSON.parse(body);
        console.log(body);
        console.log(temp.Details);
    });
});

app.get('/sendOTP', function (req,res) {
    res.render('index');

    res.end();
});

app.post('/sendOTP',function (req, res) {
    number = req.body.number;
    console.log(number);
    var request = require("request");

    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/'+number+'/AUTOGEN',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
        var temp = JSON.parse(body);
        console.log(temp.Details);

        sid = temp.Details;


        });
});

app.get('/VerifyOTP', function (req,res) {
    res.render('verify');
    res.end();
});

app.post('/VerifyOTP',function (req, res) {
    otp = req.body.number;
    console.log(otp);


    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+sid+'/'+otp,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log('verifyotp');
        console.log(body);
        var temp = JSON.parse(body);
        console.log(temp.Details);

        res.send(temp.Details);

    });


});


app.listen(app.get('port'), function () {
    console.log('server connected to http:localhost:' + app.get('port'));
});
