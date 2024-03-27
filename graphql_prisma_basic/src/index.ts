import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import MariaDbHandler from "./MariaDbHandler";

import { ActorType, MovieType, CharacterType } from "./types";

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
            return await prisma.actors.findMany();
        },
        async actor(_: undefined, args: {id: string}) {
            return await prisma.actors.findUnique({
                where: {
                    id: parseInt(args.id),
                }
            })
        },
        async movies() {
            return await prisma.movies.findMany();
        },
        async movie(_: undefined, args: {id: string}) {
            return await prisma.movies.findUnique({
                where: {
                    id: parseInt(args.id),
                }
            })
        },
        async moviesByCategory(_: undefined, args: {category: string}) {
            try {
                return await prisma.movies.findMany({
                    where: {
                        category2movie: {
                            some: {
                                categories: {
                                    type: args.category
                                }
                            }
                        }
                    }
                })
            } catch (e) {
                console.error(e)
            }
        },
    },
    Actor: {
        async movies(parent: ActorType) {
            return await prisma.movies.findMany({
                where: {
                    movie2actor: {
                        some: {
                            actor_id: parent.id
                        }
                    }
                }
            })
        }
    },
    Movie: {
        async characters(parent: MovieType) {
            return await prisma.movie2actor.findMany({
                where: {
                    movie_id: parent.id
                }
            })
        },
        async categories(parent: MovieType) {
            // console.log(parent.id)
            const result = await prisma.categories.findMany({
                where: {
                    category2movie: {
                        some: {
                            movie_id: parent.id
                        }
                    }
                }
            })
            const newResult = result.map(category => {return category.type})
            return newResult;
        }
    },
    Character: {
        async played_by(parent: CharacterType) {
            const result = await prisma.actors.findUnique({
                where: {
                    id: parent.actor_id
                }
            })

            return result;
        }
    }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 5000 },
});

console.log(`🚀  Server ready at: ${url}`);
