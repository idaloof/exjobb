import DataLoader from "dataloader";
import MariaDbHandler from "./MariaDbHandler.js";

export const moviesLoader = new DataLoader(batchFunctionMovies);

async function batchFunctionMovies(keys: (string | number)[]): Promise<any> {
    const handler = MariaDbHandler.getInstance();
    const movies = await handler.findByJoinMoviesActor(keys);

    const moviesMap = {};
    movies.forEach(movie => {
        if (!moviesMap[movie.actor_id]) {
            moviesMap[movie.actor_id] = [];
        }
        moviesMap[movie.actor_id].push(movie);
    });

    return keys.map(key => moviesMap[key] || []);
}

export const charactersLoader = new DataLoader(batchFunctionCharacters);

async function batchFunctionCharacters(keys: (string | number)[]): Promise<any> {
    const handler = MariaDbHandler.getInstance();
    const characters = await handler.findBy("movie2actor", keys, "movie_id");
    const charactersMap = {};

    characters.forEach(character => {
        if (!charactersMap[character.movie_id]) {
            charactersMap[character.movie_id] = []
        }
        charactersMap[character.movie_id].push(character)
    });

    return keys.map((key) => charactersMap[key]);
}

export const categoriesLoader = new DataLoader(batchFunctionCategories);

async function batchFunctionCategories(keys: (string | number)[]): Promise<any> {
    const handler = MariaDbHandler.getInstance();
    const categories = await handler.findByJoinMoviesCategory(keys);

    const categoriesMap = {};
    categories.forEach(category => {
        if (!categoriesMap[category.movie_id]) {
            categoriesMap[category.movie_id] = [];
        }
        categoriesMap[category.movie_id].push(category);
    });

    return keys.map(key => categoriesMap[key] || []);
}

export const playedByLoader = new DataLoader(batchFunctionPlayedBy)

async function batchFunctionPlayedBy(keys: (string | number)[]): Promise<any> {
    const handler = MariaDbHandler.getInstance();
    const actors = await handler.findBy("actors", keys, "id");
    const actorsMap = {};

    actors.forEach(actor => {
        actorsMap[actor.id] = actor;
    });

    return keys.map((key) => actorsMap[key]);
}

export const manuscriptLoader = new DataLoader(batchFunctionManuscript)

async function batchFunctionManuscript(keys: (string | number)[]): Promise<any> {
    const handler = MariaDbHandler.getInstance();
    const manuscripts = await handler.findBy("manus", keys, "author_id");
    const authorMap = {};

    manuscripts.forEach(manus => {
        if (!authorMap[manus.author_id]) {
            authorMap[manus.author_id] = []
        }
        authorMap[manus.author_id].push(manus)
    });

    return keys.map((key) => authorMap[key] || []);
}
