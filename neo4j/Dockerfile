FROM neo4j:5.18.0

COPY ./cypher_import /var/lib/neo4j/import
COPY wrapper.sh /startup/wrapper.sh

ENTRYPOINT ["/startup/wrapper.sh"]
