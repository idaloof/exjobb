import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

// The '@mutation(operations: [])' removes all the automated mutations from the neo4j diver
// The '@filterable' is to limit what can be used when filtering with a 'where' clause
const typeDefs = `#graphql
    type Actor @mutation(operations: []) {
        id: ID
        first_name: String
        last_name: String
        movies: [Movie!]! @relationship(type: "ACTED_IN", properties: "Character", direction: OUT, aggregate: false)
        manuscripts: [Manus!]! @relationship(type: "HAS_WRITTEN", direction: OUT, aggregate: false)
    }

    type Manus @mutation(operations: []) {
        id: ID
        year: Int
    }

    type Character @relationshipProperties {
        character: String!
    }

    type Movie @mutation(operations: []) {
        id: Int
        title: String @filterable(byValue: false, byAggregate: false)
        rating: Float @filterable(byValue: true, byAggregate: true)
        categories: [Category!]! @relationship(type: "LISTED_IN", direction: OUT, aggregate: false) @filterable(byValue: true, byAggregate: false)
        characters: [Actor!]! @relationship(type: "ACTED_IN", properties: "Character", direction: IN, aggregate: false) @filterable(byValue: false, byAggregate: false)
    }

    type Category @mutation(operations: []) {
        type: String
    }

    extend schema @query(read: true, aggregate: false)
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
