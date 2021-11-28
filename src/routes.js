const router = require('express').Router();

const { getGenres, getGenreById, createGenre, deleteGenre } = require('./db/genres');
const { getMovies, getMovieById, createMovie, deleteMovie } = require('./db/movies');

/**
 * @apiVersion 0.1.0
 * @api {get} /genres Request all genres
 * @apiGroup Genre
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object[]} data  Array of genres.
 * @apiError {String} error Error message
 */
router.get('/genres', (req, res) => {
    getGenres(req, res);
});

/**
 * @apiVersion 0.1.0
 * @api {get} /genres/:id Request a single genre information by id
 * @apiGroup Genre
 *
 * @apiParam {String} id Genre unique id.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Object} data  Genre data
 * @apiError {String} error Error message
 */
 router.get('/genres/:id', (req, res) => {
    getGenreById(req, res);
 });

 /**
  * @apiVersion 0.1.0
  * @api {post} /genres Creates a new genre
  * @apiGroup Genre
  *
  * @apiParam {String} name Genre name
  * @apiParam {String} description Genre description
  *
  * @apiSuccess {String} message Success message.
  * @apiSuccess {Object} data  Newly created genre data
  * @apiError {String} error Error message
  */
  router.post('/genres', (req, res) => {
     createGenre(req, res);
  });

  /**
   * @apiVersion 0.1.0
   * @api {delete} /genres Deletes a genre
   * @apiGroup Genre
   *
   * @apiParam {String} id Genre unique id
   *
   * @apiSuccess {String} message Success message.
   * @apiError {String} error Error message
   */
   router.delete('/genres', (req, res) => {
      deleteGenre(req, res);
   });

   /**
    * @apiVersion 0.1.0
    * @api {get} /genres Request all movies
    * @apiGroup Movie
    *
    * @apiSuccess {String} message Success message.
    * @apiSuccess {Object[]} data  Array of movies.
    * @apiError {String} error Error message
    */
   router.get('/movies', (req, res) => {
       getMovies(req, res);
   });

   /**
    * @apiVersion 0.1.0
    * @api {get} /movies/:id Request a single movie information by id
    * @apiGroup Movie
    *
    * @apiParam {String} id Movie unique id.
    *
    * @apiSuccess {String} message Success message.
    * @apiSuccess {Object} data  Movie data
    * @apiError {String} error Error message
    */
    router.get('/movies/:id', (req, res) => {
       getMovieById(req, res);
    });

    /**
     * @apiVersion 0.1.0
     * @api {post} /genres Creates a new movie
     * @apiGroup Movie
     *
     * @apiParam {String} name Genre name
     * @apiParam {String} description Movie description
     * @apiParam {Date} release_date Release date in any valid date format e.g. Y-m-d
     * @apiParam {Number} rating Movie rating between 1 to 5
     * @apiParam {Number} duration Movie duration in minutes
     * @apiParam {String[]} genres Array of movie genre object IDs
     *
     * @apiSuccess {String} message Success message.
     * @apiSuccess {Object} data  Newly created movie data
     * @apiError {String} error Error message
     */
     router.post('/movies', (req, res) => {
        createMovie(req, res);
     });

     /**
      * @apiVersion 0.1.0
      * @api {delete} /genres Deletes a movie
      * @apiGroup Movie
      *
      * @apiParam {String} id Movie unique id
      *
      * @apiSuccess {String} message Success message.
      * @apiError {String} error Error message
      */
      router.delete('/movies', (req, res) => {
         deleteMovie(req, res);
      });

module.exports = router;
