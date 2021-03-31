-- SQL DDL

CREATE TABLE extra_charge (
  weight   DOUBLE (5, 2) NOT NULL,
  shipping DOUBLE (5, 2) NOT NULL,
  handling DOUBLE (5, 2) NOT NULL,
  PRIMARY KEY (weight));
  
CREATE TABLE inventory (
  number INT NOT NULL PRIMARY KEY,
  quantity INT NOT NULL);
  
CREATE TABLE customer(
	customer_id		int NOT NULL AUTO_INCREMENT,
	order_collection_id 	int NOT NULL,
	email			char(255) NOT NULL,
	first_name		char(255) NOT NULL,
	last_name 		char(255) NOT NULL,
	address			char(255) NOT NULL,
	PRIMARY KEY(customer_id)
);

CREATE TABLE `order` (
   order_id                   INT PRIMARY KEY AUTO_INCREMENT,
   customer_id                INT NOT NULL,
   part_collection_id         INT NOT NULL, 
   weight                     DOUBLE(5, 2) NOT NULL,
   shipping                   DOUBLE(5, 2) NOT NULL, 
   handling                   DOUBLE(5, 2) NOT NULL, 
   charge_total               DOUBLE(5, 2) NOT NULL, 
   order_date                 TIMESTAMP NOT NULL,
   status                     CHAR(255) NOT NULL,
   FOREIGN KEY(customer_id)          REFERENCES customer(customer_id)
);

CREATE TABLE part_collection (
  part_collection_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id int NOT NULL,
  number INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES `order`(order_id),
  FOREIGN KEY (number) REFERENCES inventory(number));

CREATE TABLE position (
    position_id int PRIMARY KEY AUTO_INCREMENT,
    position_description char(255) NOT NULL
);

CREATE TABLE account (
    account_id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name char(255) NOT NULL,
    last_name char(255) NOT NULL,
    `password` char(255) NOT NULL
);

CREATE TABLE position_collection (
    position_collection_id int PRIMARY KEY AUTO_INCREMENT,
    position_id int NOT NULL,
    account_id int NOT NULL,
    FOREIGN KEY (position_id) REFERENCES position (position_id),
    FOREIGN KEY (account_id) REFERENCES account (account_id)
);