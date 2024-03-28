import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
    // log: ['query']
});

import { ApolloServer, BaseContext } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { ActorType, MovieType } from "./types";

import { PrismaSelect } from "@paljs/plugins";
import { GraphQLResolveInfo } from "graphql";

// A schema is a collection of type definitions.
// To work with Prisma types Movies and Categories represent the junctiontables
// to be able to resolve the many-to-many connections with PrismaSelect
const typeDefs = `#graphql
    type Actor {
        id: ID
        first_name: String
        last_name: String
        movies: [Movies]
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

    type Movies {
        movie: Movie
    }

    type Movie {
        id: ID
        title: String
        rating: Float
        characters: [Character]
        categories: [Categories]
    }

    type Categories {
        category: Category
    }

    type Category {
        type: String
    }

    type Query {
        actors(take: Int): [Actor]
        actor(id: Int!): Actor
        movies: [Movie]
        movie (id: Int!): Movie
        moviesByCategory(category: String!): [Movie]
    }
`;

// Resolvers define how to fetch the types defined in your schema.
const resolvers = {
    Query: {
        async actors(_: undefined, { take = 10 }, __, info: GraphQLResolveInfo): Promise<ActorType[]> {
            const select = new PrismaSelect(info).value;
            const res = await prisma.actors.findMany({
                take, 
                ...select
            });

            return res;
        },
        async actor(_: undefined, args: { id: number }, __, info: GraphQLResolveInfo): Promise<ActorType | null> {
            const select = new PrismaSelect(info).value;
            const res = await prisma.actors.findUnique({
                where: {
                    id: args.id
                },
                ...select
            });

            return res
        },
        async movies(_: undefined, { take = 10 }, __, info: GraphQLResolveInfo): Promise<MovieType[]> {
            const select = new PrismaSelect(info).value;
            const res = await prisma.movies.findMany({
                take, 
                ...select
            });

            return res
        },
        async movie(_: undefined, args: { id: number }, __, info: GraphQLResolveInfo): Promise<MovieType | null> {
            const select = new PrismaSelect(info).value;
            const res = await prisma.movies.findUnique({
                where: {
                    id: args.id
                },
                ...select
            });

            return res
        },
        async moviesByCategory(_: undefined, args: { category: string }, __, info: GraphQLResolveInfo): Promise<MovieType[] | undefined> {
            try {
                const select = new PrismaSelect(info).value;
                const res = await prisma.movies.findMany({
                    where: {
                        categories: {
                            some: {
                                category: {
                                    type: args.category
                                }
                            }
                        }
                    },
                    ...select
                });

                return res;
            } catch (e) {
                console.error(e);
            }
        },
    }
};

// The ApolloServer constructor requires two parameters, schema and resolvers
const server = new ApolloServer<BaseContext>({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
const { url } = await startStandaloneServer(server, {
    listen: { port: 5500 },
});

console.log(`🚀  Server ready at: ${url}`);
