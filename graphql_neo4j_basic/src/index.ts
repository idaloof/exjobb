import dotenv from "dotenv";
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import neo4j from "neo4j-driver";
import { ActorType, MovieType, CharacterType } from "./types";

dotenv.config();

const typeDefs = `#graphql
    type Actor {
        id: Int
        first_name: String
        last_name: String
        movies: [Movie!]
        manuscripts: [Manus!]
    }

    type Manus {
        id: Int
        year: Int
    }

    type Movie {
        id: Int
        title: String
        rating: Float
        categories: [Category!]
        characters: [Character!]
    }

    type Character {
        character: String
        played_by: Actor
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
    }
`;

const driver = neo4j.driver(
    `neo4j://${process.env.NEO4J_HOST}:7687`,
    neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASS)
);

const resolvers = {
    Query: {
        actors: async () => {
            const session = driver.session();
            try {
                const result = await session.run('MATCH (a:Actor) RETURN a');
                return result.records.map(record => {;
                    const actor = record.get('a').properties;
                    actor.id = actor.id.toString();
                    return actor;
                });
            } finally {
                await session.close();
            }
        },
        actor: async (_: undefined, args: {id: number}) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (a:Actor) WHERE a.id = ${args.id} RETURN a`);
                const actor = result.records[0].get('a').properties;
                actor.id = actor.id.toString();
                return actor;
            } finally {
                await session.close();
            }
        },
        movies: async () => {
            const session = driver.session();
            try {
                const result = await session.run('MATCH (m:Movie) RETURN m');
                return result.records.map(record => {;
                    const movie = record.get('m').properties;
                    movie.id = movie.id.toString();
                    return movie;
                });
            } finally {
                await session.close();
            }
        },
        movie: async (_: undefined, args: {id: number}) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (m:Movie) WHERE m.id = ${args.id} RETURN m`);
                const movie = result.records[0].get('m').properties;
                movie.id = movie.id.toString();
                return movie;
            } finally {
                await session.close();
            }
        },
        moviesByCategory: async (_: undefined, args: {category: string}) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (m:Movie)-[:LISTED_IN]->(c:Category) WHERE c.type = "${args.category}" RETURN m`)
                return result.records.map(record => {;
                    const movie = record.get('m').properties;
                    movie.id = movie.id.toString();
                    return movie;
                });
            } finally {
                await session.close();
            }
        }
    },
    Actor: {
        movies: async (parent: ActorType) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (a:Actor)-[:ACTED_IN]->(m:Movie) WHERE a.id = ${parent.id} RETURN m`);
                return result.records.map(record => {;
                    const movie = record.get('m').properties;
                    movie.id = movie.id.toString();
                    return movie;
                });
            } finally {
                await session.close();
            }
        },
        manuscripts: async (parent: ActorType) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (a:Actor)-[:HAS_WRITTEN]->(m:Manus) WHERE a.id = ${parent.id} RETURN m`);
                return result.records.map(record => {
                    const manuscript = record.get('m').properties;
                    manuscript.id = manuscript.id.toString();
                    manuscript.year = parseInt(manuscript.year.toString());
                    return manuscript;
                });
            } finally {
                await session.close();
            }
        },
    },
    Movie: {
        categories: async (parent: MovieType) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (m:Movie)-[:LISTED_IN]->(c:Category) WHERE m.id = ${parent.id} RETURN c`);
                return result.records.map(record => record.get('c').properties);
            } finally {
                await session.close();
            }
        },
        characters: async (parent: MovieType) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (a:Actor)-[i:ACTED_IN]->(m:Movie) WHERE m.id = ${parent.id} RETURN i`);
                console.log(result.records)
                return result.records.map(record => record.get('i').properties);
            } finally {
                await session.close();
            }
        }
    },
    Character: {
        played_by: async (parent: CharacterType) => {
            const session = driver.session();
            try {
                const result = await session.run(`MATCH (a:Actor)-[i:ACTED_IN]->(m:Movie) WHERE i.character = "${parent.character}" RETURN a`);
                const actor = result.records[0].get('a').properties;
                actor.id = actor.id.toString();
                return actor;
            } finally {
                await session.close();
            }
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

console.log(`🚀 Server ready at ${url}`);
