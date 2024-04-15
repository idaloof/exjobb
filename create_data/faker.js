import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';

export default {
    /**
     * Generates an array of manuscripts with random author IDs and years
     * @param {number} noOfManuscripts - The number of manuscripts to generate
     * @param {number} noOfAuthors - The number of authors available
     * @returns {{id: number, author_id: number, year: number}[]} Array of generated manuscripts
     */
    createManuscript: function (noOfManuscripts = 1000, noOfAuthors = 1000) {
        const manus = [];
        const max = 2023;
        const min = 1975;

        for (let counter = 1; counter <= noOfManuscripts; counter++) {
            manus.push({
                id: counter,
                author_id: Math.floor(Math.random() * noOfAuthors) + 1,
                year: Math.floor(Math.random() * (max - min + 1) + min)
            })
        }

        return manus;
    },

    /**
     * Generates an array of actors with random first and last names
     * @param {number} noOfActors - The number of actors to generate
     * @returns {{id: number, first_name: string, last_name: string}[]} Array of generated actors
     */
    createActor: function (noOfActors = 1000) {
        const persons = []

        for (let counter = 1; counter <= noOfActors; counter++) {
            persons.push({
                id: counter,
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName()
            })
        }

        return persons;
    },

    /**
     * Generates an array of movies with random titles and ratings
     * @param {number} noOfMovies - The number of movies to generate
     * @returns {{id: number, title: string, rating: number}[]} Array of generated movies
     */
    createMovie: function (noOfMovies = 1000) {
        const movies = []

        for (let counter = 1; counter <= noOfMovies; counter++) {
            movies.push({
                id: counter,
                title: faker.music.songName(),
                rating: Math.round(Math.random() * 100) / 10
            })
        }

        return movies;
    },

    /**
     * Generates an array of categories with predefined types
     * @returns {{id: number, type: string}[]} Array of generated categories
     */
    createCategory: function () {
        const category_list = ["action", "adventure", "comedy", "drama", "fantasy", "horror", "musicals", "mystery", "romance", "science fiction", "sports", "thriller", "western"]
        const nrOfCat = category_list.length
        const categories = []

        for (let counter = 0; counter < nrOfCat; counter++) {
            categories.push({
                id: counter + 1,
                type: category_list[counter]
            })
        }

        return categories;
    },

    /**
     * Generates connections between movies and categories
     * @param {number} noOfMovies - The number of movies to generate connections for
     * @returns {{category_id: number, movie_id: number}[]} Array of generated movie-category connections
     */
    createMovieCategoryConnection: function (noOfMovies = 1000) {
        const moviesAndCategories = []
        const max = 13
        const min = 1

        for (let counter = 1; counter <= noOfMovies; counter++) {
            const random_category = Math.floor(Math.random() * (max - min + 1) + min)
            moviesAndCategories.push({
                category_id: random_category,
                movie_id: counter
            })

            if (counter % 2 === 0) {
                const random_category2 = Math.floor(Math.random() * (max - min + 1) + min)
                if (random_category2 !== random_category) {
                    moviesAndCategories.push({
                        category_id: random_category2,
                        movie_id: counter
                    })
                }
            }
        }

        return moviesAndCategories;
    },

    /**
     * Generates connections between movies and actors with characters
     * @param {number} noOfMovies - The number of movies to generate connections for
     * @param {number} actorsInMovies - The maximum number of actors in each movie
     * @returns {{movie_id: number, person_id: number, character: string}[]} Array of generated movie-person connections
     */
    createMovieActorConnection: function (noOfMovies = 1000, actorsInMovies = 10) {
        const moviesAndPersons = []
        let alreadyInMovie;
        let person;

        for (let counter = 1; counter <= noOfMovies; counter++) {
            alreadyInMovie = [];

            for (let index = 0; index < actorsInMovies; index++) {
                person = Math.floor(Math.random() * 1000) + 1;

                if (!alreadyInMovie.includes(person)) {
                    moviesAndPersons.push({
                        movie_id: counter,
                        actor_id: person,
                        character: faker.person.fullName()
                    })

                    alreadyInMovie.push(person);
                }
            }
        }

        return moviesAndPersons;
    },

    /**
     * Writes data to a CSV file
     * @param {string} filename - The name of the file to write to
     * @param {Object[]} data - The data to write to the file
     */
    writeToFile: function (filename, data) {
        const fileDirectory = 'csv';
        if (!fs.existsSync(fileDirectory)) {
            fs.mkdirSync(fileDirectory);
        }
        const filePath = path.join(fileDirectory, filename);
        const headers = Object.keys(data[0]);
        let headerRow = headers.join(',') + '\n';
    
        fs.appendFileSync(filePath, headerRow, (err) => {
            if (err) {
                console.log(err);
            }
        });
    
        data.forEach(item => {
            let row = headers.map(header => `"${item[header]}"`);
            row = row.join(',') + '\n';
    
            fs.appendFileSync(filePath, row, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        })
    }
}
