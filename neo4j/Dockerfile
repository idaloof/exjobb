FROM neo4j:5.18.0

# NOTE! Context when creating this Dockerfile in docker-compose is from
# the root of the repo, not the neo4j folder. This is so the csv folder can copied.
COPY ./neo4j/cypher_import /var/lib/neo4j/import
COPY ./csv /var/lib/neo4j/import
COPY ./neo4j/wrapper.sh /startup/wrapper.sh

ENTRYPOINT ["/startup/wrapper.sh"]
