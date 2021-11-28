# Movies API

## Database
This project uses MongoDB and the database is hosted on a shared cluster on Atlas cloud. There are 2 primary entities/collections as mentioned below.

* Genres
* Movies

## API
API is built using Node and Express and deployed on Heroku cloud. Link for the API is [Base API Endpoint](https://moviesdb-api.herokuapp.com/api/)

API documentation can be found in the section below.

## API Docs
API documentation can be found under `docs` directory. Also available at [https://yetanotherse.github.io/moviesapi/](https://yetanotherse.github.io/moviesapi/).

*Note* If you do not see any API docs then select the version as `0.1.0` from the top right of page.

## Test Suite/Jest
Tests have beeb written for API endpoints testing using `Jest`. Tests are available under `src/tests` directory and can be run using `yarn test` or `npm run test`. They connect to a secondary test database which is also hosted on Atlas cloud.
