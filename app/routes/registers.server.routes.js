'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var registers = require('../../app/controllers/registers');

	// Registers Routes
	app.route('/registers')
		.get(registers.list)
		.post(users.requiresLogin, registers.create);

	app.route('/registers/:registerId')
		.get(registers.read)
		.put(users.requiresLogin, registers.hasAuthorization, registers.update)
		.delete(users.requiresLogin, registers.hasAuthorization, registers.delete);

	// Finish by binding the Register middleware
	app.param('registerId', registers.registerByID);
};