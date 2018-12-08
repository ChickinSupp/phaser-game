CREATE DATABASE userRanks_db;
USE userRanks_db;

CREATE TABLE ranks (
    id NOT NULL AUTO_INCREMENT,
    high_score INT NOT NULL,
    hits INT NOT NULL,
    PRIMARY KEY (id)
)