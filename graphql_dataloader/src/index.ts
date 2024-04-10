import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import MariaDbHandler from "./MariaDbHandler.js";

import { ActorType, MovieType, CharacterType } from "./types";
import { moviesLoader, charactersLoader, categoriesLoader, playedByLoader, manuscriptLoader } from "./loaders.js";

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
        year: Int
    }

    type Character {
        character: String
        played_by: Actor
    }

    type Movie {
        id: ID
        title: String
        rating: Float
        characters: [Character]
        categories: [Category]
    }

    type Category {
        type: String
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

            return res;
        },
        async manuscripts(parent: ActorType) {
            const res = await manuscriptLoader.load(parent.id);

            return res;
        }
    },
    Movie: {
        async characters(parent: MovieType) {
            const res = await charactersLoader.load(parent.id);

            return res;
        },
        async categories(parent: MovieType) {
            const res = await categoriesLoader.load(parent.id);

            return res;
        }
    },
    Character: {
        async played_by(parent: CharacterType) {
            const res = await playedByLoader.load(parent.character);

            return res;
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
