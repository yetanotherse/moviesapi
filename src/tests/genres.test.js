const app = require("../server");
const mongoose = require("mongoose");
const supertest = require("supertest");

const { Genre, genreSchema } = require('../db/schema/genre');

describe('Genre related test cases', () => {
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
    })

    // test successful creation of a new genre
    test("POST /api/genres (Successfull Create)", async () => {
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
            // validate data
            expect(response.body.data.name).toBe('Horror');
            expect(response.body.data.description).toBe('Horror movies');
        });
    });


    // nagative test case for creation of genre with invalid request params
    test("POST /api/genres (Unsuccessfull Create)", async () => {
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
            expect(Array.isArray(response.body.data)).toBeTruthy();
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
    });
});
