var Auth = require('../core/Authentication'),
	User = require('../data/User'),
	Lost = require('../data/Lost'),
	Found = require('../data/Found'),
	Category = require('../data/Category');

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('home', { 
			user : req.user,
			error: req.flash('error')
		});
	});
	
	app.get('/login', function(req, res) {
		res.render('login', { 
			user : req.user,
			error: res.local('error') || req.flash('error')
		});
	});
	
	app.post('/login',
		passport.authenticate('local', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true,
			successFlash: "Welcome :)"
		})
	);
	
	app.get('/logout', function(req, res){
		req.logOut();
		res.redirect('/');
	});
	
	app.get('/categories', Auth.isAdmin, function(req, res) {
		Category.find({}, function(err, categories){
            res.render('categories', { 
        		user : req.user,
    			error: req.flash('error') || err,
                categories: categories
    		});
        });
	});
	
	app.get('/declareLoss', Auth.isAuthenticated, function(req, res) {
		res.render('declareLoss', { 
			user : req.user,
			error: req.flash('error')
		});
	});
	
	app.get('/loss', Auth.isVolunteer, function(req, res) {
		res.render('loss', { 
			user : req.user,
			error: req.flash('error')
		});
	});
	
	app.get('/user', Auth.isAdmin, function(req, res) {
		User.find({}, {_id:0, password: 0}, function(err, users) {
			res.render('user', { 
				user : req.user,
				error: req.flash('error') || err,
				users: users
			});
		});		
	});
	
	app.post('/user', Auth.isAdmin, function(req, res) {
		User.create(req.body.user, function(createErr, user) {
			User.find({}, {_id:0, password: 0}, function(err, users) {
				res.render('user', { 
					user : req.user,
					error: (createErr ? "Something went wrong" : undefined) || req.flash('error') || err,
					users: users,
					createdUser: user
				});
			});
		});		
	});
	
	app.get('/register', function(req, res) {
		res.render('register', { 
			user : req.user,
			error: req.flash('error')
		});
	});
};