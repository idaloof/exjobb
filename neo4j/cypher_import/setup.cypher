// Create indexes for nodes
CREATE CONSTRAINT idx_actor IF NOT EXISTS FOR (a:Actor) REQUIRE a.id IS UNIQUE;
CREATE CONSTRAINT idx_movie IF NOT EXISTS FOR (m:Movie) REQUIRE m.id IS UNIQUE;
CREATE CONSTRAINT idx_category IF NOT EXISTS FOR (c:Category) REQUIRE c.id IS UNIQUE;
CREATE CONSTRAINT idx_manus IF NOT EXISTS FOR (m:Manus) REQUIRE m.id IS UNIQUE;

// Delete all nodes
MATCH (all) DELETE all;

// Load data from csv
LOAD CSV WITH HEADERS FROM 'file:///csv/actors.csv' AS row
MERGE (a:Actor {id: toInteger(row.id), first_name: row.first_name, last_name: row.last_name});

LOAD CSV WITH HEADERS FROM 'file:///csv/movies.csv' AS row
MERGE (m:Movie {id: toInteger(row.id), title: row.title, rating: toFloat(row.rating)});

LOAD CSV WITH HEADERS FROM 'file:///csv/categories.csv' AS row
MERGE (c:Category {id: toInteger(row.id), type: row.type});

LOAD CSV WITH HEADERS FROM 'file:///csv/manus.csv' AS row
MERGE (m:Manus {id: toInteger(row.id), author_id: toInteger(row.author_id), year: toInteger(row.year)});

// Load relationships
LOAD CSV WITH HEADERS FROM 'file:///csv/category2movie.csv' AS row
MATCH (category:Category {id: toInteger(row.category_id)})
MATCH (movie:Movie {id: toInteger(row.movie_id)})
MERGE (movie)-[:LISTED_IN]->(category);

LOAD CSV WITH HEADERS FROM 'file:///csv/movie2actor.csv' AS row
MATCH (actor:Actor {id: toInteger(row.actor_id)})
MATCH (movie:Movie {id: toInteger(row.movie_id)})
MERGE (actor)-[char:ACTED_IN]->(movie)
    ON CREATE SET char.character = row.character;

LOAD CSV WITH HEADERS FROM 'file:///csv/manus.csv' AS row
MATCH (actor:Actor {id: toInteger(row.author_id)})
MATCH (manus:Manus {id: toInteger(row.id)})
MERGE (actor)-[:HAS_WRITTEN]->(manus);
