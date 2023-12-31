const mongoose = require('mongoose');
const env = require('./env');

const db = mongoose
	.connect(env.MONGODB_URI)
	.then((db) => {
		console.log('Successfully connected to MongoDB.');
		return db.connection.getClient();
	})
	.catch((e) => {
		console.log('Failed to connect to database!', e);
		process.exit(1);
	});

module.exports = db;
