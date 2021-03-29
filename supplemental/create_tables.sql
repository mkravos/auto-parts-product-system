-- SQL DDL

CREATE TABLE extra_charge (
  weight   DOUBLE (5, 2) NOT NULL,
  shipping DOUBLE (5, 2) NOT NULL,
  handling DOUBLE (5, 2) NOT NULL,
  PRIMARY KEY (weight)
);
  
CREATE TABLE inventory (
  number   INT NOT NULL PRIMARY KEY,
  quantity INT NOT NULL,
  FOREIGN KEY(number) REFERENCES parts(number)
);
  
CREATE TABLE part_collection (
  part_collection_id INT PRIMARY KEY AUTO_INCREMENT,
  order_id           INT NOT NULL,
  number             INT NOT NULL,
  quantity           INT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES order(order_id),
  FOREIGN KEY (number)   REFERENCES inventory(number)
);

CREATE TABLE customer(
	customer_id INT NOT NULL AUTO_INCREMENT,
	email       CHAR(255) NOT NULL,
	first_name  CHAR(255) NOT NULL,
	last_name   CHAR(255) NOT NULL,
	address     CHAR(255) NOT NULL,
	PRIMARY KEY(customer_id)
);

CREATE TABLE order (
   order_id                   INT PRIMARY KEY AUTO_INCREMENT,
   customer_id                INT NOT NULL,
   weight                     DOUBLE(5, 2) NOT NULL,
   shipping                   DOUBLE(5, 2) NOT NULL, 
   handling                   DOUBLE(5, 2) NOT NULL, 
   charge_total               DOUBLE(5, 2) NOT NULL, 
   order_date                 TIMESTAMP NOT NULL,
   status                     CHAR(255) NOT NULL,
   FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE account(
    account_id INT NOT NULL AUTO_INCREMENT,
    first_name CHAR(255) NOT NULL,
    last_name  CHAR(255) NOT NULL,
    password   CHAR(255) NOT NULL,
    PRIMARY KEY(account_id)
);

CREATE TABLE position_collection(
    position_collection_id INT PRIMARY KEY AUTO_INCREMENT,
    position_id            INT NOT NULL,
    account_id             INT NOT NULL,
    FOREIGN KEY(position_id) REFERENCES position(position_id),
    FOREIGN KEY(account_id)  REFERENCES account(account_id)
);

CREATE TABLE position(
    position_id          INT PRIMARY KEY AUTO_INCREMENT,
    position_description CHAR(255) NOT NULL
);
