require('dotenv/config');

module.exports = {
	PORT: process.env.PORT || 5000,
	NODE_ENV: process.env.NODE_ENV,
	MONGODB_URI: process.env.MONGODB_URI,
};
