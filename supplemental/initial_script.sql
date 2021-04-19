-- SQL DDL
CREATE DATABASE IF NOT EXISTS customer_interaction_db;
USE customer_interaction_db;

CREATE TABLE IF NOT EXISTS inventory (
   number   INT NOT NULL PRIMARY KEY,
   quantity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS customer (
	customer_id INT NOT NULL AUTO_INCREMENT,
	email	      CHAR(255) NOT NULL,
	first_name	CHAR(255) NOT NULL,
	last_name 	CHAR(255) NOT NULL,
	address		CHAR(255) NOT NULL,
	PRIMARY KEY(customer_id)
);

CREATE TABLE IF NOT EXISTS `order` (
   order_id     INT PRIMARY KEY AUTO_INCREMENT,
   customer_id  INT NOT NULL,
   weight       DOUBLE(5, 2) NOT NULL,
   shipping     DOUBLE(5, 2) NOT NULL, 
   handling     DOUBLE(5, 2) NOT NULL, 
   charge_total DOUBLE(5, 2) NOT NULL, 
   order_date   TIMESTAMP NOT NULL,
   status       CHAR(255) NOT NULL,
   FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE IF NOT EXISTS part_collection (
   part_collection_id INT PRIMARY KEY AUTO_INCREMENT,
   order_id           INT NOT NULL,
   number             INT NOT NULL,
   quantity           INT NOT NULL,
   FOREIGN KEY(order_id) REFERENCES `order`(order_id),
   FOREIGN KEY(number)   REFERENCES inventory(number)
);

CREATE TABLE IF NOT EXISTS extra_charge (
   weight   DOUBLE(5, 2) NOT NULL,
   shipping DOUBLE(5, 2) NOT NULL,
   handling DOUBLE(5, 2) NOT NULL,
   PRIMARY KEY(weight)
);
  
CREATE DATABASE IF NOT EXISTS login_db;
USE login_db;

CREATE TABLE IF NOT EXISTS account (
   account_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
   first_name CHAR(255) NOT NULL,
   last_name  CHAR(255) NOT NULL,
   `password` CHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS position (
   position_id          INT PRIMARY KEY AUTO_INCREMENT,
   position_description CHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS position_collection (
   position_collection_id INT PRIMARY KEY AUTO_INCREMENT,
   position_id            INT NOT NULL,
   account_id             INT NOT NULL,
   FOREIGN KEY(position_id) REFERENCES position (position_id),
   FOREIGN KEY(account_id)  REFERENCES account (account_id)
);