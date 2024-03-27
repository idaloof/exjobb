docker run --interactive --tty --publish=7474:7474 --publish=7687:7687 --volume=./data:/data --user="$(id -u):$(id -g)" --volume=./import:/import neo4j:5.18.0 neo4j-admin database import full --nodes=Actor=/import/actors.csv --nodes=Movie=/import/movies.csv --relationships=ACTED_IN=/import/movie2actor.csv --nodes=Category=/import/categories.csv --relationships=LISTED_IN=/import/category2movie.csv
