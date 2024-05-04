# exjobb

This repo is all the source code used for a report at BTH comparing differnet GraphQL APIs. To be able to use test this repo you need to have Docker installed.

## Setup

Create you local .env file with all needed variables, see .env.example. The easiest setup would be to just copy and rename that example file.

In the csv-folder you can find folders with serveral csv-files containg data to populate the databases with. Copy files from the wanted folder into the csv-folder. When setting up any of the two databases they will import the files located in the csv-folder, not in the subfolders. See an example using bash:

```bash
# stand in the folder csv
cp 1000_movies/* .
```

## Usage

To start one or even all API's there is a bash-script making the setup easier. See list below for commands.

```
Commands:

   up                   Start all containers.
   down                 Shut down all the running containers.

   Containers not solving N+1:

   basic                Start graphql_basic and mariadb.
   prismabasic          Start graphql_prismabasic and mariadb.

   Containers solving N+1:

   dataloader           Start graphql_dataloader and mariadb.
   joinmonster          Start graphql_joinmonster and mariadb.
   prisma               Start graphql_prisma and mariadb.
   neo4j                Start graphql_neo4j and neo4j.

Options:

   -h, --help      Display the menu
   -v, --version   Display the current version
```

To run a command just type:

```bash
./start.bash <command>
```
When shutting down the containers and remove local images and volumes just run:

```bash
./start.bash down
```
