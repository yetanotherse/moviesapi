const mongoose = require('mongoose');
const { Genre, genreSchema } = require('./schema/genre');

async function getGenres(req, res) {
    try {
        const genres = await Genre.find({}).sort({ "name": 1 }).exec();
        if (genres.length) {
            res.json({
                message: 'Successfully fetched all genres',
                data: genres
            });
        } else {
            res.json({
                message: 'No genres found!',
                data: null
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

async function getGenreById(req, res) {
    try {
        if (mongoose.isValidObjectId(req.params.id)) {
            const genre = await Genre.findById(req.params.id).exec();
            if (genre) {
                res.json({
                    message: 'Successfully fetched genre information',
                    data: genre
                });
            } else {
                res.status(404).json({
                    message: 'Genre does not exist!'
                });
            }
        } else {
            res.status(400).json({
                message: 'Invalid genre!'
            });
        }
    } catch(error) {
        res.status(422).json({
            error
        });
    }
}

async function createGenre(req, res) {
    // basic request validation
    if (
        Object.keys(req.body).length !== 2 || // assume all fields required
        !req.body.hasOwnProperty('name') ||
        !req.body.hasOwnProperty('description')
    ) {
        res.status(400).json({
            error: 'Invalid request. Please check the requst params.'
        });
    } else {
        try {
            const genre = await Genre.create({
                name: req.body.name,
                description: req.body.description
            });
            res.json({
                message: 'Genre created successfully',
                data: genre
            });
        } catch(error) {
            res.status(422).json({
                error
            });
        }
    }
}

async function deleteGenre(req, res) {
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
            await Genre.findByIdAndRemove(req.body.id);
            res.json({
                message: 'Genre deleted successfully'
            });
        } catch(error) {
            res.status(422).json({
                error
            });
        }
    }
}

module.exports = {
    getGenres,
    getGenreById,
    createGenre,
    deleteGenre
};
