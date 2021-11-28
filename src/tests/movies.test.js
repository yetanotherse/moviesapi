const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

const { Movie, movieSchema } = require('../db/schema/movie');
const { Genre, genreSchema } = require('../db/schema/genre');

describe('Movie related test cases', () => {
    beforeAll((done) => {
        mongoose.connect(process.env.MONGODB_TESTDB_URI,
        { useNewUrlParser: true },
        () => done());
    });

    afterAll((done) => {
        mongoose.connection.close(true, () => done());
    });

    // cleanup after each test
    afterEach(async () => {
        await Genre.deleteMany();
        await Movie.deleteMany();
    })

    // test successful creation of a new movie
    test("POST /api/movies (Successfull Create)", async () => {
        // first we need to create a genre
        await supertest(app).post("/api/genres")
        .send({
        	name: "Horror",
            description: "Horror movies"
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            // now create the movie
            await supertest(app).post("/api/movies")
            .send({
            	name: "The Conjuring",
                description: "One of the better horror movies in recent times",
                release_date: '2000-01-01',
                rating: 3.5,
                duration: 120,
                genres: [response.body.data._id]
            })
            .expect(200)
            .then((response) => {
                // validate response
                expect(response.body.message).toBeTruthy();
                expect(response.body.message).toBe('Movie created successfully');
                // validate movie data
                expect(response.body.data.name).toBe('The Conjuring');
                expect(response.body.data.description).toBe('One of the better horror movies in recent times');
                expect(response.body.data.release_date).toBe('2000-01-01T00:00:00.000Z'); // stored as time
                expect(response.body.data.rating).toEqual(3.5);
                expect(response.body.data.duration).toEqual(120);
                expect(Array.isArray(response.body.data.genres)).toBeTruthy(); // genres is an array
            });
        });
    });

    // fetch a single movie by ID
    test("GET /api/movies (Successfull Get Single)", async () => {
        // let's first create a new genre and use it's ID to fetch it again
        let genreId = null;
        await supertest(app).post("/api/genres")
        .send({
            name: "Drama",
            description: "Drama movies"
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            genreId = response.body.data._id;
        });
        // now create a movie using this genre
        await supertest(app).post("/api/movies")
        .send({
            name: "Forrest Gump",
            description: "One of Tom Hanks best performances",
            release_date: '1994-01-01',
            rating: 4.9,
            duration: 140,
            genres: [genreId]
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Movie created successfully');
            // now make a request to fetch ths movie
            await supertest(app).get(`/api/movies/${response.body.data._id}`)
            .send()
            .expect(200)
            .then((response) => {
                // validate response
                expect(response.body.data).toBeTruthy();
                expect(response.body.message).toBe('Successfully fetched movie information');
                // validate data
                expect(response.body.data.name).toBe('Forrest Gump');
                expect(response.body.data.description).toBe('One of Tom Hanks best performances');
                expect(response.body.data.release_date).toBe('1994-01-01T00:00:00.000Z'); // stored as time
                expect(response.body.data.rating).toEqual(4.9);
                expect(response.body.data.duration).toEqual(140);
                expect(Array.isArray(response.body.data.genres)).toBeTruthy(); // genres is an array
            });
        });
    });

    // test successful GET of a all movies
    test("GET /api/genres (Successfull Get All)", async () => {
        // let's create 2 movies and then verify it
        // first we need to create geners
        let genre1Id = null;
        let genre2Id = null;
        await supertest(app).post("/api/genres")
        .send({
        	name: "Horror",
            description: "Horror movies"
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            genre1Id = response.body.data._id;
        });
        await supertest(app).post("/api/genres")
        .send({
        	name: "Drama",
            description: "Drama movies"
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            genre2Id = response.body.data._id;
        });
        // now create 2 movies
        await supertest(app).post("/api/movies")
        .send({
            name: "The Conjuring",
            description: "One of the better horror movies in recent times",
            release_date: '2000-01-01',
            rating: 3.5,
            duration: 120,
            genres: [genre1Id]
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Movie created successfully');
        });
        await supertest(app).post("/api/movies")
        .send({
            name: "Forrest Gump",
            description: "One of Tom Hanks best performances",
            release_date: '1994-01-01',
            rating: 4.9,
            duration: 140,
            genres: [genre2Id]
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Movie created successfully');
        });
        // now validate the movies
        await supertest(app).get("/api/movies")
        .send()
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Successfully fetched all movies');
            // validate data
            expect(Array.isArray(response.body.data)).toBeTruthy();
            expect(response.body.data.length).toBe(2); // we created 2 movies
        });
    });

    // delete a movie
    test("DELETE /api/movies (Successfull Delete Single)", async () => {
        // let's create a new movie first and then we'll try removing it
        await supertest(app).post("/api/genres")
        .send({
        	name: "Horror",
            description: "Horror movies"
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            // now create the movie
            await supertest(app).post("/api/movies")
            .send({
            	name: "The Conjuring",
                description: "One of the better horror movies in recent times",
                release_date: '2000-01-01',
                rating: 3.5,
                duration: 120,
                genres: [response.body.data._id]
            })
            .expect(200)
            .then(async (response) => {
                // validate response
                expect(response.body.message).toBeTruthy();
                expect(response.body.message).toBe('Movie created successfully');
                // Now remove it and validate
                const toBeDeletedId = response.body.data._id;
                await supertest(app).delete("/api/movies")
                .send({
                    id: toBeDeletedId
                })
                .expect(200)
                .then(async (response) => {
                    // validate response
                    expect(response.body.message).toBe('Movie deleted successfully');
                    // now query this deleted genre
                    await supertest(app).get(`/api/movies/${toBeDeletedId}`)
                    .send()
                    .expect(404)
                    .then((response) => {
                        // validate response
                        expect(response.body.message).toBe('Movie does not exist!');
                    });
                });
            });
        });
    });


    // nagative test case for creation of genre with invalid request params
    /*test("POST /api/genres (Unsuccessfull Create)", async () => {
        await supertest(app).post("/api/genres")
        .send({
        	naem: "there is a typo in this param" // incorrect param name and description field missing
        })
        .expect(400)
        .then((response) => {
            // validate response
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('Invalid request. Please check the requst params.');
        });
    });

    // fetch a single genre by ID
    test("GET /api/genres (Successfull Get Single)", async () => {
        // let's first create a new genre and use it's ID to fetch it again
        await supertest(app).post("/api/genres")
        .send({
            name: "Fantasy",
            description: "Fantasy movies"
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            // now make another request to fetch this movie using it's ID
            await supertest(app).get(`/api/genres/${response.body.data._id}`)
            .send()
            .expect(200)
            .then((response) => {
                // validate response
                expect(response.body.data).toBeTruthy();
                expect(response.body.message).toBe('Successfully fetched genre information');
                // validate data
                expect(response.body.data.name).toBe('Fantasy');
                expect(response.body.data.description).toBe('Fantasy movies');
            });
        });
    });

    // test successful GET of a all genres
    test("GET /api/genres (Successfull Get All)", async () => {
        // let's create 2 genres and then verify it
        await supertest(app).post("/api/genres")
        .send({
        	name: "Horror",
            description: "Horror movies"
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
        });
        await supertest(app).post("/api/genres")
        .send({
        	name: "Drama",
            description: "Drama movies"
        })
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
        });
        await supertest(app).get("/api/genres")
        .send()
        .expect(200)
        .then((response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Successfully fetched all genres');
            // validate data
            expect(response.body.data.length).toBe(2); // we created 2 genre (Horror and Drama)
        });
    });

    // delete a genre
    test("DELETE /api/genres (Successfull Delete Single)", async () => {
        // let's create a new genre first and then we'll try removing it
        await supertest(app).post("/api/genres")
        .send({
            name: "Drama",
            description: "Drama movies"
        })
        .expect(200)
        .then(async (response) => {
            // validate response
            expect(response.body.data).toBeTruthy();
            expect(response.body.message).toBe('Genre created successfully');
            // now make another request to fetch this movie using it's ID
            // save the ID for query later
            const toBeDeletedId = response.body.data._id;
            await supertest(app).delete("/api/genres")
            .send({
                id: toBeDeletedId
            })
            .expect(200)
            .then(async (response) => {
                // validate response
                expect(response.body.message).toBe('Genre deleted successfully');
                // now query this deleted genre
                await supertest(app).get(`/api/genres/${toBeDeletedId}`)
                .send()
                .expect(404)
                .then((response) => {
                    // validate response
                    expect(response.body.message).toBe('Genre does not exist!');
                });
            });
        });
    });*/
});
