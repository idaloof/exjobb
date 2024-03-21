import CreateModel from './faker.js';

// Create manus
CreateModel.writeToFile("manus.csv", CreateModel.createManuscript());

// Create users
CreateModel.writeToFile("persons.csv", CreateModel.createPerson())

// Create movies
// CreateModel.writeToFile("movies.csv", CreateModel.createMovie())

// Create categories
// CreateModel.writeToFile("categories.csv", CreateModel.createCategory())

// Create movie category connection
// CreateModel.writeToFile("category2movie.csv", CreateModel.createMovieCategoryConnection())

// Create movie person connection
// CreateModel.writeToFile("movie2person.csv", CreateModel.createMoviePersonConnection())

// // Create posts
// CreateModel.writeToFile("posts.csv", CreateModel.createPosts())

// Create friends connections
// CreateModel.writeToFile("friends.csv", CreateModel.createFriendConnection());
