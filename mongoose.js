const mongoose = require('mongoose');

module.exports = async () => {
	await mongoose.connect(process.env.Mongo, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	return mongoose;
}