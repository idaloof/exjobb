#!/bin/bash

# Log the info with the same format as NEO4J outputs
log_info() {
  # https://www.howtogeek.com/410442/how-to-display-the-date-and-time-in-the-linux-terminal-and-use-it-in-bash-scripts/
  printf '%s %s\n' "$(date -u +"%Y-%m-%d %H:%M:%S:%3N%z") INFO  Wrapper: $1"
  return
}

# Adapted from https://github.com/neo4j/docker-neo4j/issues/166#issuecomment-486890785
# turn on bash's job control
# https://stackoverflow.com/questions/11821378/what-does-bashno-job-control-in-this-shell-mean/46829294#46829294
set -m

# Start the primary process and put it in the background
/startup/docker-entrypoint.sh neo4j &

# wait for Neo4j
log_info "Waiting until neo4j stats at :7474 ..."

# Maximum number of retries
MAX_RETRIES=20

# Wait time between retries (in seconds)
WAIT_TIME=2

# Counter for retry attempts
retry_count=0

function is_server_reachable() {
    wget -q --spider http://localhost:7474
}

while ! is_server_reachable && ((retry_count < MAX_RETRIES)); do
    ((retry_count++))
    sleep $WAIT_TIME
done

if [ -d "$(pwd)/import" ]; then
    user=$(echo "neo4j/p@sSw0rd" | grep -o '^[^/]*')
    pass=$(echo "neo4j/p@sSw0rd" | grep -o '/.*$' | cut -c 2-)

    log_info  "Loading cyphers from '/import'"
    for cypherfile in "$(pwd)/import"/*.cypher; do
        log_info "Running cypher ${cypherfile}"
        cypher-shell -u "${user}" -p "${pass}" -f "${cypherfile}"
        log_info "Done with ${cypherfile}"
    done
    log_info "Loading complete"
fi

# now we bring the primary process back into the foreground
# and leave it there, the /dev/null is for not showing any printouts
fg %1 > /dev/null
