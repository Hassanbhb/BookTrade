'use strict';

var path = process.cwd();
var ProfileHandler = require(path + "/app/controllers/profileHandler.server.js");

module.exports = function (app, passport) {

	var profileHandler = new ProfileHandler();

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/');
		}
	}

	app.route('/')
		.get(function (req, res) {
			res.render("home", {user: req.user});
		});

	app.route('/allbooks')
		.get(profileHandler.getallbooks)
		.post(profileHandler.trade)
		.delete(profileHandler.deleteTrade);

	app.route('/user/books')
		.get(profileHandler.getuserbooks)
		.post(profileHandler.acceptTrade);
		
	app.route('/mybooks')
		.get(isLoggedIn, profileHandler.getbooks)
		.delete(profileHandler.deleteUserBook);
		
	
	app.route('/mybooks/search')
		.post(isLoggedIn, profileHandler.searchBook);	

	app.route('/mybooks/addmybook')
		.post(isLoggedIn, profileHandler.updateMyBooks);	
		
	app.route('/profile')
		.get(isLoggedIn, function(req, res){
			res.render('profile', {user: req.user.facebook});
		})

	app.route('/profile/update')
		.post(isLoggedIn, profileHandler.updateProfile);	

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/');
		});

	app.route('/auth/facebook')
		.get(passport.authenticate('facebook'));

	app.route('/auth/facebook/callback')
		.get(passport.authenticate('facebook', {failureRedirect: '/'}),
			function(req, res){
				res.redirect('/');
			});

};
