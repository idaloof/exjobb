-- CreateTable
CREATE TABLE `actors` (
    `id` INTEGER NOT NULL,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL,
    `type` VARCHAR(15) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category2movie` (
    `category_id` INTEGER NOT NULL,
    `movie_id` INTEGER NOT NULL,

    INDEX `movie_id`(`movie_id`),
    PRIMARY KEY (`category_id`, `movie_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `manus` (
    `id` INTEGER NOT NULL,
    `author_id` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,

    INDEX `author_id`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movie2actor` (
    `movie_id` INTEGER NOT NULL,
    `actor_id` INTEGER NOT NULL,
    `character` VARCHAR(255) NOT NULL,

    INDEX `actor_id`(`actor_id`),
    PRIMARY KEY (`movie_id`, `actor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `movies` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `rating` FLOAT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `category2movie` ADD CONSTRAINT `category2movie_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `category2movie` ADD CONSTRAINT `category2movie_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `manus` ADD CONSTRAINT `manus_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movie2actor` ADD CONSTRAINT `movie2actor_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `movie2actor` ADD CONSTRAINT `movie2actor_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `actors`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

