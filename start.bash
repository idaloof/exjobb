#!/usr/bin/env bash
#
# Bash script for setting up the mariadb container
#
# Exit values:
#  0 on success
#  1 on failure
#

# Name of the script
SCRIPT=$( basename "$0" )

# Current version
VERSION="0.0.1"

#
# Message to display for usage and help.
#
function usage
{
    local txt=(
""
"Script $SCRIPT is used to work with log-data."
"Usage: $SCRIPT [options] <command> [arguments]"
""
"Commands:"
""
"   up                   Start the container."
"   down                 Shut down the container."
""
""
"Options:"
""
"   -h, --help      Display the menu"
"   -v, --version   Display the current version"
""
    )

    printf "%s\\n" "${txt[@]}"
}


#
# Message to display when bad usage.
#
function badUsage
{
    local message="$1"
    local txt=(
"For an overview of the command, execute:"
"$SCRIPT -h, --help"
    )

    [[ -n $message ]] && printf "%s\\n" "$message"

    printf "%s\\n" "${txt[@]}"
}


#
# Message to display for version.
#
function version
{
    local txt=(
"$SCRIPT version $VERSION"
    )

    printf "%s\\n" "${txt[@]}"
}

#
# Function to start the container
#
function app-up
{
    # Start the containers and enter the server container in bash
    docker-compose up -d --build
}

#
# Function to start the basic graphql server container
#
function app-basic
{
    # Start the containers and enter the server container in bash
    docker-compose up -d --build mariadb graphql_server
}

#
# Function to start the dataloader container
#
function app-dataloader
{
    # Start the containers and enter the server container in bash
    docker-compose up -d --build mariadb graphql_dataloader
}

#
# Function to start the dataloader container
#
function app-joinmonster
{
    # Start the containers and enter the server container in bash
    docker-compose up -d --build mariadb graphql_joinmonster
}

#
# Function to start the prisma_basic container
#
function app-prismabasic
{
    # Start the containers and enter the server container in bash
    docker-compose up -d --build mariadb graphql_prisma_basic
}

#
# Function to start the prisma container
#
function app-prisma
{
    # Start the containers and enter the server container in bash
    docker-compose up -d --build mariadb graphql_prisma
}

#
# Function to start the prisma container
#
function app-neo4j
{
    # Start the containers
    docker-compose up -d --build neo4j graphql_neo4j
}


#
# Function to shut down the network
#
function app-down
{
    # Container will be closed when exiting, but this will remove all imagess
    docker-compose down -v --rmi local
}

#
# Process options
#
function main
{
    while (( $# ))
    do
        case "$1" in

            --help | -h)
                usage
                exit 0
            ;;

            --version | -v)
                version
                exit 0
            ;;

            up             \
            | basic        \
            | dataloader   \
            | joinmonster  \
            | prismabasic  \
            | prisma       \
            | neo4j        \
            | down)
                command="$1"
                shift
                app-"$command" "$@"
                exit 0
            ;;

            *)
                badUsage "Option/command not recognized."
                exit 1
            ;;

        esac
    done

    badUsage
    exit 1
}

main "$@"