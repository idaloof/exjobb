import readline from 'readline';
import CreateModel from './faker.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


/**
 * Asks a question to the user via readline interface
 * @param {string} prompt - The question prompt
 * @returns {Promise<string>} The user's answer
 */
function askQuestion(prompt) {
    return new Promise((resolve, reject) => {
        rl.question(prompt, (answer) => {
            resolve(answer);
        });
    });
}

/**
 * Gets user arguments by asking a series of questions
 * @returns {Promise<number[]>} Array of user arguments
 */
async function getArguments() {
    const userArguments = [];
    const questions = [
        'Number of actors: ',
        'Number of manuses: ',
        'Number of movies: ',
        'Maximum number of actors in movies: ',
    ];

    for (const question of questions) {
        let answer = await askQuestion(question);

        userArguments.push(parseInt(answer));
    }
    rl.close();

    return userArguments;
}

/**
 * Main function to create CSV files based on user input
 */
async function main() {
    const userInput = await getArguments();

    // Create actors
    CreateModel.writeToFile("actors.csv", CreateModel.createActor(userInput[0]))

    // Create manus
    CreateModel.writeToFile("manus.csv", CreateModel.createManuscript(userInput[1], userInput[0]));

    // Create movies
    CreateModel.writeToFile("movies.csv", CreateModel.createMovie(userInput[2]))

    // Create categories
    CreateModel.writeToFile("categories.csv", CreateModel.createCategory())

    // Create movie category connection
    CreateModel.writeToFile("category2movie.csv", CreateModel.createMovieCategoryConnection(userInput[2]))

    // Create movie actor connection
    CreateModel.writeToFile("movie2actor.csv", CreateModel.createMovieActorConnection(userInput[2], userInput[3]))

    console.log("CSV-files created!");
};

main();
