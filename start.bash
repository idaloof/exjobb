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
# Function to shut down the container
#
function app-down
{
    # Container will be closed when exiting, but this will remove all imagess
    docker-compose down -v --rmi all
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

            up            \
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