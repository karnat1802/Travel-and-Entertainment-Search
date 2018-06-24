'use strict'
var http = require('http');
var fs = require('fs');
var express = require('express');
const yelp = require('yelp-fusion');
const client = yelp.client('2mvKD2p6h18aJ3WJncrvXCfy93grAQzhkmjLd3IaqzeK7qW_WP0xoovmhBkp8SR2oxYAKGz0k9iZ5mANK7Ri64XvNy16h71eg5lAzadyYptcuzyLSu12KtPikR7MWnYx');
var Promise = require('promise');
var app = express();
var request = require('request');
var path =  require('path');
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


// app.use(function (req, res, next) {
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
// res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
// res.setHeader('Access-Control-Allow-Credentials', true);
// next();
// });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/',function(req,res)
{
	res.send("Hello World!");
});

app.use(express.static(path.join(__dirname,'public')))

var jsonData ={
	"happy" : "yes"
}
var lat
var lon;
app.get('/search',function(req,res){
	console.log("Request Recieved");
	var category = req.query.category;
	if(category == "default")
	{
		category = "";
	}
	var distance = req.query.distance;
	var keyword = req.query.keyword;
	
	var location = req.query.loc;
	var mapResponse = {};
	var searchResponse =  {};
	var test = {};
	if(location=="here")
	{
		lat = req.query.latitude;
		lon = req.query.longitude;
		location = lat+","+lon;
		console.log(category+" "+distance+" "+keyword+" "+location);
		var parameters ={
				category:category,
				distance:distance,
				keyword:keyword,
				location:location
			}
		// console.log(typeof location);
		request(
			{
				url:	'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location+'&radius='+distance+'&type='+category+'&keyword='+keyword+'&key=AIzaSyBRRgrf8C3UVkabAaJOSN5xvhW0xt0HUJs'
			
		}).pipe(res);
		// var response = JSON.stringify(jsonData);
		//  res.json(response);

		
	}
	else 
	 {
		request("https://maps.googleapis.com/maps/api/geocode/json?address="+location+"&key=AIzaSyBzbOugXmAGP3VFuN7wK151a3WMA95drrs",function(error,response,body){
		 if(!error&&response.statusCode==200){
		 	mapResponse = JSON.parse(body);
		 	// console.log(mapResponse);
		 // 	var response = JSON.stringify(mapResponse);
			// res.json(response);
			
		 	lat = (mapResponse.results[0].geometry.location.lat);
		 	lon = (mapResponse.results[0].geometry.location.lng);
		 	// console.log(lat);
		 	// console.log(lon);
		 	location = lat+","+lon;
		 	 // console.log(category+" "+distance+" "+keyword+" "+location);
		 // 	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location+'&radius='+distance+'&type='+category+'&keyword='+keyword+'&key=AIzaSyBRRgrf8C3UVkabAaJOSN5xvhW0xt0HUJs',function(error,response,body){
			// if(!error&&response.statusCode==200){
			// searchResponse = JSON.parse(body);
			// console.log(searchResponse);
			// var response = JSON.stringify(searchResponse);
			// res.json(response);
			}
			console.log(category+" "+distance+" "+keyword+" "+location);
			var parameters ={
				category:category,
				distance:distance,
				keyword:keyword,
				location:location
			}
			request(
			{
				url:	'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+location+'&radius='+distance+'&type='+category+'&keyword='+keyword+'&key=AIzaSyBRRgrf8C3UVkabAaJOSN5xvhW0xt0HUJs'
			
			}).pipe(res);
		});
			// console.log(category+" "+distance+" "+keyword+" "+location);
			// var response = JSON.stringify(jsonData);
		 // res.json(response);
		 }
		 // console.log(category+" "+distance+" "+keyword+" "+location);
		 // console.log(category+" "+distance+" "+keyword+" "+location);
		 // var response = JSON.stringify(jsonData);
		 // res.json(response);
		// });
		
	 // }
	//  console.log(category+" "+distance+" "+keyword+" "+location);
	// var response = JSON.stringify(jsonData);
	// 	 res.json(response);
	
});




app.get('/next',function(req,res){
	console.log("Request Recieved");
	var pagetoken = req.query.next_page_token;
	// console.log(category);
	var searchResponse =  {};
	request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+pagetoken+'&key=AIzaSyBRRgrf8C3UVkabAaJOSN5xvhW0xt0HUJs',function(error,response,body){
		if(!error&&response.statusCode==200){
			searchResponse = JSON.parse(body);
			// console.log(searchResponse);
			// var response = JSON.stringify(searchResponse);
			res.json(searchResponse);
		}
	});

	

});

app.get('/placesearch',function(req,res){
	console.log("Request Recieved");
	var placeid = req.query.placeid;
	// console.log(category);
	var searchResponse =  {};
	request(
			{
				url:	'https://maps.googleapis.com/maps/api/place/details/json?placeid='+placeid+'&key=AIzaSyBRRgrf8C3UVkabAaJOSN5xvhW0xt0HUJs'
			
			}).pipe(res);

	

});





app.get('/yelpmatch',function(req,res){
	console.log("Request Recieved");
	console.log(req.query);
	// console.log(category);
	// var searchResponse =  {};
	// request('https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken='+pagetoken+'&key=AIzaSyBRRgrf8C3UVkabAaJOSN5xvhW0xt0HUJs',function(error,response,body){
	// 	if(!error&&response.statusCode==200){
	// 		searchResponse = JSON.parse(body);
	// 		// console.log(searchResponse);
	// 		var response = JSON.stringify(searchResponse);
	// 		res.json(response);
	// 	}
	// });
	
	var address1 = req.query.address;
	var city = req.query.city;
	var state = req.query.state;
	var country = req.query.country;
	var name ="";
	for (var i = 0; i < req.query.name.length; i++) {
  	if(req.query.name.charAt(i)!= "/")
  	{
  		name = name + req.query.name.charAt(i)
  	}
	}
	console.log(name+" "+address1+" "+city+" "+state+" "+country);
	client.businessMatch('best', {
  	name: name,
  	address1: address1 ,
  	city: city,
  	state: state,
  	country: country	
	}).then(response => {
  	console.log(response.jsonBody);
  	var yelpres = response.jsonBody.businesses;
  	if(yelpres.length < 1 )
  	{
  		var response = JSON.stringify(jsonData);
		 res.json(response);
  	}
  	else
  	{
  		var businessid= response.jsonBody.businesses[0].id;
  		var url = 'https://api.yelp.com/v3/businesses/'+businessid+'/reviews';
  		var options = {
  			url: url,
  			headers: {
  				'Authorization': 'Bearer 2mvKD2p6h18aJ3WJncrvXCfy93grAQzhkmjLd3IaqzeK7qW_WP0xoovmhBkp8SR2oxYAKGz0k9iZ5mANK7Ri64XvNy16h71eg5lAzadyYptcuzyLSu12KtPikR7MWnYx'
  			}
  		};

  		function callback(error,response,body){
		if(!error&&response.statusCode==200){
			var info = JSON.parse(body);
			// console.log(searchResponse);
			console.log(info);
			var response = JSON.stringify(info);
			
			res.json(response);
		}
		}
		request(options,callback);
	}	
  	

	}).catch(e => {
  	console.log(e);
  	console.log("There was an error");
	});
	
	

});




app.listen(8081,function(){
    console.log('Server started on port 3000');
});

