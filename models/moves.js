const mongoose = require('mongoose');

const movesSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: String,
	comments: String,
	thumbsUp: Boolean,
	link: String,
});

const Moves = mongoose.model('Moves', movesSchema);

module.exports = Moves;