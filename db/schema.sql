CREATE DATABASE user_ranksDB;
USE user_ranksDB;

CREATE TABLE ranks (
    id NOT NULL AUTO_INCREMENT,
    high_score INT NOT NULL,
    hits INT NOT NULL,
    PRIMARY KEY (id)
)