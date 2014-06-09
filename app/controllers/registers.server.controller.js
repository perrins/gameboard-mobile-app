'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Register = mongoose.model('Register'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Register already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Register
 */
exports.create = function(req, res) {
	var register = new Register(req.body);
	register.user = req.user;

	register.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(register);
		}
	});
};

/**
 * Show the current Register
 */
exports.read = function(req, res) {
	res.jsonp(req.register);
};

/**
 * Update a Register
 */
exports.update = function(req, res) {
	var register = req.register ;

	register = _.extend(register , req.body);

	register.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(register);
		}
	});
};

/**
 * Delete an Register
 */
exports.delete = function(req, res) {
	var register = req.register ;

	register.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(register);
		}
	});
};

/**
 * List of Registers
 */
exports.list = function(req, res) { Register.find().sort('-created').populate('user', 'displayName').exec(function(err, registers) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(registers);
		}
	});
};

/**
 * Register middleware
 */
exports.registerByID = function(req, res, next, id) { Register.findById(id).populate('user', 'displayName').exec(function(err, register) {
		if (err) return next(err);
		if (! register) return next(new Error('Failed to load Register ' + id));
		req.register = register ;
		next();
	});
};

/**
 * Register authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.register.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};