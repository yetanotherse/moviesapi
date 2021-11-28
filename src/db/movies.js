const mongoose = require('mongoose');
const { Movie, movieSchema } = require('./schema/movie');

async function getMovies(req, res) {
    try {
        const movies = await Movie.find({}).sort({ "name": 1 }).populate('genres').exec();
        if (movies.length) {
            res.json({
                message: 'Successfully fetched all movies',
                data: movies
            });
        } else {
            res.status(200).json({
                message: 'No movies found!',
                data: null
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

async function getMovieById(req, res) {
    try {
        if (mongoose.isValidObjectId(req.params.id)) {
            const movie = await Movie.findById(req.params.id).populate('genres').exec();
            if (movie) {
                res.json({
                    message: 'Successfully fetched movie information',
                    data: movie
                });
            } else {
                res.status(404).json({
                    message: 'Movie does not exist!'
                });
            }
        } else {
            res.status(400).json({
                message: 'Invalid movie!'
            });
        }
    } catch(error) {
        console.log(error);
        res.status(422).json({
            error
        });
    }
}

async function createMovie(req, res) {
    // basic request validation
    if (
        Object.keys(req.body).length !== 6 || // assume all fields required
        !req.body.hasOwnProperty('name') ||
        !req.body.hasOwnProperty('description') ||
        !req.body.hasOwnProperty('release_date') ||
        !req.body.hasOwnProperty('rating') ||
        !req.body.hasOwnProperty('duration') ||
        !req.body.hasOwnProperty('genres') ||
        !Array.isArray(req.body.genres)
    ) {
        res.status(400).json({
            error: 'Invalid request. Please check the requst params.'
        });
    } else {
        try {
            // validation for fields can be done here before creation
            // skipping it for the assignment but happy to discuss during
            // further rounds on validation approaches
            const movie = await Movie.create({
                name: req.body.name,
                description: req.body.description,
                release_date: req.body.release_date,
                rating: req.body.rating,
                duration: req.body.duration,
                genres: req.body.genres
            });
            res.json({
                message: 'Movie created successfully',
                data: movie
            });
        } catch(error) {
            res.status(422).json({
                error
            });
        }
    }
}

async function deleteMovie(req, res) {
    // basic request validation
    if (
        Object.keys(req.body).length !== 1 || // we need only id in request
        !req.body.hasOwnProperty('id') ||
        !mongoose.isValidObjectId(req.body.id)
    ) {
        res.status(400).json({
            error: 'Invalid request. Please check the requst params.'
        });
    } else {
        try {
            await Movie.findByIdAndRemove(req.body.id);
            res.json({
                message: 'Movie deleted successfully'
            });
        } catch(error) {
            res.status(422).json({
                error
            });
        }
    }
}

module.exports = {
    getMovies,
    getMovieById,
    createMovie,
    deleteMovie
};
