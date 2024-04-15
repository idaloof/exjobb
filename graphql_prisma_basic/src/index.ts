import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { ActorType, MovieType, CharacterType } from "./types";

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
        actor(id: Int!): Actor
        movies: [Movie]
        movie (id: Int!): Movie
        moviesByCategory(category: String!): [Movie]
    }
`;

const resolvers = {
    Query: {
        async actors() {
            return await prisma.actors.findMany();
        },
        async actor(_: undefined, args: {id: number}) {
            return await prisma.actors.findUnique({
                where: {
                    id: args.id,
                }
            })
        },
        async movies() {
            return await prisma.movies.findMany();
        },
        async movie(_: undefined, args: {id: number}) {
            return await prisma.movies.findUnique({
                where: {
                    id: args.id,
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
        },
        async manuscripts(parent: ActorType) {
            return await prisma.manus.findMany({
                where: {
                    author_id: parent.id
                }
            })
        },
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
            const result = await prisma.categories.findMany({
                where: {
                    category2movie: {
                        some: {
                            movie_id: parent.id
                        }
                    }
                }
            })
            return result;
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

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
