const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new mongoose.Schema({
    name: String,
    description: String,
    release_date: Date,
    rating: Number,
    duration: Number,
    genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }]
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = {
    Movie,
    movieSchema
};
