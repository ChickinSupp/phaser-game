CREATE DATABASE user_ranksDB;
USE user_ranksDB;

CREATE TABLE ranks (
                       id NOT NULL AUTO_INCREMENT,
                       name VARCHAR(50) NOT NULL,
                       attempts INT NOT NULL,
                       hits INT NOT NULL,
                       PRIMARY KEY (id)
)