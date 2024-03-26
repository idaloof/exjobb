DROP TABLE IF EXISTS `movie2actor`;
DROP TABLE IF EXISTS `category2movie`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `movies`;
DROP TABLE IF EXISTS `manus`;
DROP TABLE IF EXISTS `actors`;

-- Create table for actors
CREATE TABLE `actors` (
    `id` INT NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
);

-- Create table for manus
CREATE TABLE `manus` (
    `id` INT NOT NULL,
    `author_id` INT NOT NULL,
    `year` INT NOT NULL,

    PRIMARY KEY (`id`),
    FOREIGN KEY (`author_id`) REFERENCES `actors` (`id`)
);

-- Create table for movies
CREATE TABLE `movies` (
    `id` INT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `rating` FLOAT NOT NULL,

    PRIMARY KEY (`id`)
);

-- Create table for categories
CREATE TABLE `categories` (
    `id` INT NOT NULL,
    `type` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
);

-- Create table for category2movie
CREATE TABLE `category2movie` (
    `category_id` INT NOT NULL,
    `movie_id` INT NOT NULL,

    PRIMARY KEY (`category_id`, `movie_id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`)
);

-- Create table for movie2actor
CREATE TABLE `movie2actor` (
    `movie_id` INT NOT NULL,
    `actor_id` INT NOT NULL,
    `character` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`movie_id`, `actor_id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
    FOREIGN KEY (`actor_id`) REFERENCES `actors` (`id`)
);
