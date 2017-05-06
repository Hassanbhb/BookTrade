'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	facebook: {
		id: String,
		name: String,
		city: String,
		state: String
	},
	books: [{
		bookname: String,
		bookimg: String
	}],
	trade: [{
		ownerOne: String,
		bookimgOne: String,
		ownerTwo: String,
		bookimgTwo: String,
		tradeId: Number,
		status: String
	}]
});

module.exports = mongoose.model('User', User);
