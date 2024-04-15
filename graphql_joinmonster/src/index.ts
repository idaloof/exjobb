import dotenv from "dotenv";

dotenv.config();

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import MariaDbHandler from "./MariaDbHandler.js";
import joinMonsterAdapt from 'join-monster-graphql-tools-adapter';
import joinMonster from 'join-monster';
import { makeExecutableSchema } from '@graphql-tools/schema';

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
    }
`;

const resolvers = {
    Query: {
        actors (parent: undefined, args: {}, ctx: any, resolveInfo: any) {
            /**@ts-ignore, ignoring joinmoster since it is missing types */
            return joinMonster.default(resolveInfo, ctx, async (sql: string) => {
                const dbHandler = MariaDbHandler.getInstance();                

                return await dbHandler.queryNoArgs(sql)
            }, { dialect: 'mariadb' })
        },
        actor (parent: undefined, args: {id: number}, ctx: any, resolveInfo: any) {
            /**@ts-ignore, ignoring joinmoster since it is missing types */
            return joinMonster.default(resolveInfo, ctx, async (sql: string) => {
                const dbHandler = MariaDbHandler.getInstance();

                return await dbHandler.queryNoArgs(sql)
            }, { dialect: 'mariadb' })
        },
        movies (parent: undefined, args: {}, ctx: any, resolveInfo: any) {
            /**@ts-ignore, ignoring joinmoster since it is missing types */
            return joinMonster.default(resolveInfo, ctx, async (sql: string) => {
                const dbHandler = MariaDbHandler.getInstance();

                return await dbHandler.queryNoArgs(sql)
            }, { dialect: 'mariadb' })
        },
        movie (parent: undefined, args: {id: number}, ctx: any, resolveInfo: any) {
            /**@ts-ignore, ignoring joinmoster since it is missing types */
            return joinMonster.default(resolveInfo, ctx, async (sql: string) => {
                const dbHandler = MariaDbHandler.getInstance();

                return await dbHandler.queryNoArgs(sql)
            }, { dialect: 'mariadb' })
        },
        moviesByCategory(parent: undefined, args: {category: string}, ctx: any, resolveInfo: any) {
            /**@ts-ignore, ignoring joinmoster since it is missing types */
            return joinMonster.default(resolveInfo, ctx, async (sql: string) => {
                const dbHandler = MariaDbHandler.getInstance();

                return await dbHandler.queryNoArgs(sql)
            }, { dialect: 'mariadb' })
        },
    }
};

// Schema to manipulate for joinmonster
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

// Adding needed extensions and fields for joinmonster
joinMonsterAdapt(schema, {
    Query: {
        fields: {
            actor: {
                extensions: {
                    joinMonster: {
                        where: (actorsTable: string, args: {id: number}) => {
                            return `${actorsTable}.id = ${args.id}`
                        }
                    }
                }
            },
            movie: {
                extensions: {
                    joinMonster: {
                        where: (moviesTable: string, args: {id: number}) => {
                            return `${moviesTable}.id = ${args.id}`
                        }
                    }
                }
            },
            moviesByCategory: {
                extensions: {
                    joinMonster: {
                        where: (moviesTable: string, args: {category: number}) => {
                            return `${moviesTable}.id IN (SELECT movie_id FROM category2movie WHERE category_id IN
                                (SELECT id FROM categories WHERE type = "${args.category}")
                            )`
                        }
                    }
                }
            }
        }
    },
    Actor: {
        extensions: {
            joinMonster: {
                sqlTable: 'actors',
                uniqueKey: 'id',
            }
        },
        fields: {
            movies: {
                extensions: {
                    joinMonster: {
                        junction: {
                            // name the table that holds the two foreign keys
                            sqlTable: 'movie2actor',
                            sqlJoins: [
                                // first the parent table to the junction
                                (followerTable, junctionTable, args) =>
                                `${followerTable}.id = ${junctionTable}.actor_id`,
                                // then the junction to the child
                                (junctionTable, followeeTable, args) =>
                                `${junctionTable}.movie_id = ${followeeTable}.id`
                            ]
                        }
                    }
                }
            },
            manuscripts: {
                extensions: {
                    joinMonster: {
                        sqlJoin: (actorsTable: string, manusTable: string) =>
                        `${actorsTable}.id = ${manusTable}.author_id`,
                    }
                }
            }
        }
    },
    Category: {
        extensions: {
            joinMonster: {
                sqlTable: 'categories',
                uniqueKey: 'id',
            }
        }
    },
    Character: {
        extensions: {
            joinMonster: {
                sqlTable: 'movie2actor',
                uniqueKey: ['movie_id', 'actor_id'],
            }
        },
        fields: {
            played_by: {
                extensions: {
                    joinMonster: {
                        sqlJoin: (characterTable: string, actorsTable: string) =>
                        `${characterTable}.actor_id = ${actorsTable}.id`,
                    }
                }
            }
        }
    },
    Manus: {
        extensions: {
            joinMonster: {
                sqlTable: 'manus',
                uniqueKey: 'id',
            }
        }
    },
    Movie: {
        extensions: {
            joinMonster: {
                sqlTable: 'movies',
                uniqueKey: 'id',
            }
        },
        fields: {
            categories: {
                extensions: {
                    joinMonster: {
                        junction: {
                            // name the table that holds the two foreign keys
                            sqlTable: 'category2movie',
                            sqlJoins: [
                                // first the parent table to the junction
                                (followerTable, junctionTable, args) =>
                                `${followerTable}.id = ${junctionTable}.movie_id`,
                                // then the junction to the child
                                (junctionTable, followeeTable, args) =>
                                `${junctionTable}.category_id = ${followeeTable}.id`
                            ]
                        }
                    }
                }
            },
            characters: {
                extensions: {
                    joinMonster: {
                        sqlJoin: (moviesTable: string, characterTable: string) =>
                        `${moviesTable}.id = ${characterTable}.movie_id`,
                    }          
                } 
            }
        }
    }
});

// The ApolloServer uses the schema witch contains the typeDefs and resolvers
const server = new ApolloServer({
    schema
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
