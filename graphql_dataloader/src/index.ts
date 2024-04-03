import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import MariaDbHandler from "./MariaDbHandler";

import { ActorType, MovieType, CharacterType } from "./types";
import { moviesLoader, charactersLoader, categoriesLoader, playedByLoader } from "./loaders";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
    type Actor {
        id: ID
        first_name: String
        last_name: String
        movies: [Movie]
        manuscripts: [Manus]
    }

    type Manus {
        id: ID
        author: Actor
        year: Int
    }

    type Character {
        character: String
        played_by: Actor
    }

    # TODO should actors be a person or actor? Where to get the role?
    # TODO should we have category as an attribute in a movie?
    type Movie {
        id: ID
        title: String
        rating: Float
        characters: [Character]
        categories: [String]
    }

    type Category {
        id: ID
        type: String
        movies(lt_rating: Float, gt_rating: Float): [Movie]
    }

    type Query {
        actors: [Actor]
        actor(id: ID!): Actor
        movies: [Movie]
        movie (id: ID!): Movie
        moviesByCategory(category: String!): [Movie]
        categories: [Category]
        category(id: ID!): Category
    }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        async actors() {
            const handler = MariaDbHandler.getInstance();

            return await handler.findAll('actors');
        },
        async actor(_: undefined, args: {id: number}) {
            const handler = MariaDbHandler.getInstance();
            const res = await handler.findBy('actors', [args.id], 'id');

            return res[0];
        },
        async movies() {
            const handler = MariaDbHandler.getInstance();

            return await handler.findAll('movies');
        },
        async movie(_: undefined, args: {id: number}) {
            const handler = MariaDbHandler.getInstance();
            const res = await handler.findBy('movies', [args.id], 'id');

            return res[0];
        },
        async moviesByCategory(_: undefined, args: {category: string}) {
            try {
                const handler = MariaDbHandler.getInstance();
                const query = `
                    SELECT * FROM movies WHERE id IN
                        (SELECT movie_id FROM category2movie WHERE category_id IN
                            (SELECT id FROM categories WHERE type = ?))
                `;

                return await handler.queryWithArgs(query, [args.category])
            } catch (err) {
                return [];
            }
        },
    },
    Actor: {
        async movies(parent: ActorType) {
            const res = await moviesLoader.load(parent.id);

            // console.log(res);

            return res;
        }
    },
    Movie: {
        async characters(parent: MovieType) {
            const res = await charactersLoader.load(parent.id);

            // console.log(res);

            return res;
        },
        async categories(parent: MovieType) {
            const res = await categoriesLoader.load(parent.id);

            // console.log(res);

            return res;
        }
    },
    Character: {
        async played_by(parent: CharacterType) {
            const res = await playedByLoader.load(parent.character);

            // console.log(res);

            return res;
        }
    }
};





// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
