DROP TABLE IF EXISTS `movie2person`;
DROP TABLE IF EXISTS `category2movie`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `movies`;
DROP TABLE IF EXISTS `manus`;
DROP TABLE IF EXISTS `persons`;

-- Create table for persons
CREATE TABLE `persons` (
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
    FOREIGN KEY (`author_id`) REFERENCES `persons` (`id`)
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

-- Create table for movie2person
CREATE TABLE `movie2person` (
    `movie_id` INT NOT NULL,
    `person_id` INT NOT NULL,
    `role` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`movie_id`, `person_id`),
    FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
    FOREIGN KEY (`person_id`) REFERENCES `persons` (`id`)
);
