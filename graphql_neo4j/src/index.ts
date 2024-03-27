import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

// const typeDefs = `#graphql
//     type Actor {
//         id: ID
//         first_name: String
//         last_name: String
//         movies: [Movie] @relationship(type: "ACTED_IN", direction: IN)
//         manuscripts: [Manus]
//     }

//     type Manus {
//         id: ID
//         author: Actor
//         year: Int
//     }

//     type Character {
//         character: String
//         played_by: Actor
//     }

//     type Movie {
//         id: ID
//         title: String
//         rating: Float
//         characters: [Character]
//         categories: [String]
//     }

//     type Category {
//         type: String
//     }

//     type Query {
//         actors: [Actor]
//         actor(id: ID!): Actor
//         movies: [Movie]
//         movie (id: ID!): Movie
//         moviesByCategory(category: String!): [Movie]
//     }
// `;

const typeDefs = `#graphql
    type Actor {
        id: ID
        first_name: String
        last_name: String
        movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }

    type Movie {
        id: Int
        title: String
        rating: Float
    }
`;

const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}:7687`,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: await neoSchema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`);
