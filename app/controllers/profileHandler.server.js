"use strict";

const Users = require('../models/users.js');
const AllBooks = require('../models/allbooks.js');
const request = require('request');

function profileHandler(){
	//update city and state fields in the profile page
	this.updateProfile = function(req, res){
		const updateFields =  {"facebook.city": req.query.city, "facebook.state": req.query.state};
		Users
			// update the city and State and return the new data
			.findOneAndUpdate({"_id": req.user._id}, updateFields, {new: true})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				
				res.send(result);
			})
	}

	//search for the book using google book api and send back a short json object to client to display
	//in the my books page as result to the search
	this.searchBook = function(req, res){
		//get search term and insert to uri
		const searchTerm = req.query.q;
		
		let	url = "https://www.googleapis.com/books/v1/volumes?q="+searchTerm+"&printType=books&maxResults=5";
		
		const reqObj = {
			uri: url,
			method: 'GET',
			timeout: 10000
		};

		let booksArr = [];
		//make a request to the uri
		request(reqObj, function(err, response, body){
			if (err) {return console.log(err)};
			
			const books = JSON.parse(body);
			//create a new object for every book returned with the fields we need
			for (var i = 0; i < books.items.length; i++) {
				let booksInfo = {
					"title": books.items[i].volumeInfo.title,
					"authors": books.items[i].volumeInfo.authors,
					"publisher": books.items[i].volumeInfo.publisher,
					"imagelinks": books.items[i].volumeInfo.imageLinks,
					"language": books.items[i].volumeInfo.language,
					"description": books.items[i].volumeInfo.description
				};
				//push the new obj to array
				booksArr.push(booksInfo);
			}
			//send array to client side
			res.send(booksArr);
		});
		
	}
	//update users books by adding books he chose from the results in mybooks page
	this.updateMyBooks = function(req, res){
		
		const book = {
			bookname: req.query.b,
			bookimg: decodeURIComponent(req.query.img)
		};
		
		//update the books of that the user owns
		Users
			.findOneAndUpdate({"_id": req.user._id}, {$push: {books: book}}, {new: true})
			.exec(function(err, result){
				if (err) {return console.log(err)};

				res.send(result);
			})

		const livre = new AllBooks({
			title: req.query.b,
			cover: req.query.img,
			owner: req.user._id
		});
		livre.save(function(err, result){
			if (err) {return console.log(err)};
			console.log("book saved in allbooks db");
		})
		
	}

	this.deleteUserBook = function(req, res){
		console.log(req.query.delbook);
		Users
			.findOneAndUpdate({"_id": req.user._id}, { $pull: { books: { bookimg: req.query.delbook }}})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				
				console.log("deleted from user");
			})

		AllBooks
			.findOneAndRemove({"owner": req.user._id})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				console.log("deleted from the all books");
				res.send('data');
			})	
	}

	this.getbooks = function(req, res){
		Users
			.findOne({"_id": req.user._id})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				res.render("mybooks", {userbooks: result.books});
			})
	};

	this.getallbooks = function(req, res){
		//get all books in the db
		AllBooks
			.find({}, {"_id": false})
			.exec(function(err, result){
				if (req.user) {
					Users
						.findOne({"_id": req.user._id})
						.exec(function(err, u){
							res.render('allbooks', {allbooks: result, text: u, user: req.user});
						})
					}else{
						res.render("allbooks", {allbooks: result, user: req.user});
					}
					
			});


	}

	this.getuserbooks = function(req,res){
		Users
			.findOne({"_id": req.user._id})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				res.send(result.books);
			})
	}

	//save the trade in both the current and the other user db 
	this.trade = function(req, res){
		
		const tradeOpiration = {
			ownerOne: req.query.owner,
			bookimgOne: req.query.imgsrc,
			ownerTwo: req.query.myBookOwner,
			bookimgTwo: req.query.mybook,
			tradeId : Math.floor((Math.random()*100000)+1),
			status: "Pending..."
		};
		

		Users
			.findOneAndUpdate({"_id": req.user._id}, {$push: {trade: tradeOpiration}}, {new: true})
			.exec(function(err, result){
				if (err) {return console.log(result)};
				console.log('trade is saved')
			})
		//update the other users trade array so he know another user wants to make trade with him
		Users
			.findOneAndUpdate({"_id": req.query.owner}, {$push: {trade: tradeOpiration}}, {new: true})
			.exec(function(err, result){
				if (err) {return console.log()}
				res.send(result);
			})	
	};

	//deleting the trade from both users dbs
	this.deleteTrade = function(req, res){
			
		// finds the users who have the tradeId and deletes the trade
		Users
			.updateMany({"trade.tradeId": req.query.tradeid}, { $pull: { trade: { tradeId: req.query.tradeid }}})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				console.log("trade deleted");
				res.send('done');
			})
	}

	this.acceptTrade = function(req, res){
		const userOne = req.user._id;
		const userTwo = req.query.usertwo;
		const tradeId = req.query.tradeid;

		Users
			.update({"trade.tradeId": tradeId}, { $set: { "trade.$.status": "Accepted" }}, {multi: true})
			.exec(function(err, result){
				if (err) {return console.log(err)};
				console.log(result);
				console.log('user one updated');
				res.send('accepted');
			})
	}

}

module.exports = profileHandler;