DROP DATABASE IF EXISTS customer_interaction_db;
DROP DATABASE IF EXISTS login_db;

-- ---------------------------------------------------------------------------80
/* for the heck of it
DROP DATABASE IF EXISTS csci467;
CREATE DATABASE IF NOT EXISTS csci467;
USE csci467;

CREATE TABLE IF NOT EXISTS parts (
   number      INT PRIMARY KEY AUTO_INCREMENT,
   description CHAR(50) NOT NULL,
   price       float(8, 2) NOT NULL,
   weight      FLOAT(4, 2) NOT NULL,
   pictureURL  CHAR(50) NOT NULL
);

-- fill tables

INSERT INTO parts (description, price, weight, pictureURL) VALUES
('Pont Yacht', 37.48, 2.00, 'http://blitz.cs.niu.edu/pics/ship.jpg'),
('Boeing X-32A JSF', 36.90, 2.00, 'http://blitz.cs.niu.edu/pics/air.jpg'),
('American Airlines: MD-11S', 40.83, 2.00, 'http://blitz.cs.niu.edu/pics/air.jpg'),
('1997 BMW F650 ST', 75.34, 3.50, 'http://blitz.cs.niu.edu/pics/mop.jpg');
*/

-- ---------------------------------------------------------------------------80
CREATE DATABASE IF NOT EXISTS customer_interaction_db;
USE customer_interaction_db;

CREATE TABLE IF NOT EXISTS extra_charge (
   weight   DOUBLE(5, 2) NOT NULL,
   shipping DOUBLE(5, 2) NOT NULL,
   handling DOUBLE(5, 2) NOT NULL,
   PRIMARY KEY(weight)
);

CREATE TABLE IF NOT EXISTS inventory (
   number   INT PRIMARY KEY,
   quantity INT NOT NULL DEFAULT 5
);

CREATE TABLE IF NOT EXISTS customer (
	customer_id INT PRIMARY KEY AUTO_INCREMENT,
	email	      CHAR(50) NOT NULL,
	first_name  CHAR(25) NOT NULL,
	last_name   CHAR(25) NOT NULL,
	address     CHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS `order` (
   order_id       INT PRIMARY KEY AUTO_INCREMENT,
   customer_id    INT NOT NULL,
   weight         DOUBLE(5, 2) NOT NULL,
   shipping       DOUBLE(5, 2) NOT NULL, 
   handling       DOUBLE(5, 2) NOT NULL, 
   charge_total   DOUBLE(5, 2) NOT NULL, 
   order_date     TIMESTAMP NOT NULL,
   status         CHAR(50) NOT NULL,
   FOREIGN KEY(customer_id) REFERENCES customer(customer_id)
);
/* transaction_id not supported by mariadb because rows are 
   determined by data outside of table :(
CREATE TABLE IF NOT EXISTS `order` (
   order_id       INT PRIMARY KEY AUTO_INCREMENT,
   transaction_id CHAR(17)
   AS
      (concat(
         cast(floor(newid()*1000) as char),
         '-',
         cast(floor(newid()*1000000000) as char),
         '-',
         cast(floor(newid()*1000) as char)
      ))
   PERSISTENT,
   customer_id    INT NOT NULL,
   weight         DOUBLE(5, 2) NOT NULL,
   shipping       DOUBLE(5, 2) NOT NULL, 
   handling       DOUBLE(5, 2) NOT NULL, 
   charge_total   DOUBLE(5, 2) NOT NULL, 
   order_date     TIMESTAMP NOT NULL,
   status         CHAR(50) NOT NULL,
);
*/

CREATE TABLE IF NOT EXISTS part_collection (
   part_collection_id INT PRIMARY KEY AUTO_INCREMENT,
   order_id           INT NOT NULL,
   number             INT NOT NULL,
   quantity           INT NOT NULL,
   FOREIGN KEY(order_id) REFERENCES `order`(order_id),
   FOREIGN KEY(number)   REFERENCES inventory(number)
);

-- fill tables

INSERT INTO extra_charge
(weight, shipping, handling) VALUES
(1.1, 2.99, 2.49),
(2.1, 3.99, 3.49),
(3.1, 4.99, 4.49);

INSERT INTO inventory
(number)
SELECT number FROM csci467.parts;

INSERT INTO customer
(email, first_name, last_name, address) VALUES
('whatin@leb.we', 'whatin', 'leb', '520890 leb way'),
('ehatin@je.we', 'ehatin', 'je', '930821 je way'),
('ihxein@at.we', 'ihxein', 'at', '732181 at way');

-- for the heck of it
INSERT INTO `order`
(customer_id, weight, shipping, handling, charge_total, order_date, status) VALUES
(
   1, 1.0,
   (SELECT shipping FROM extra_charge WHERE weight >= 1.0 AND weight < 2.1),
   (SELECT handling FROM extra_charge WHERE weight >= 1.0 AND weight < 2.1),
   10.11, (SELECT CURRENT_TIMESTAMP), 'in progress'
),
(
   2, 2.0,
   (SELECT shipping FROM extra_charge WHERE weight >= 2.0 AND weight < 3.1),
   (SELECT handling FROM extra_charge WHERE weight >= 2.0 AND weight < 3.1),
   20.22, (SELECT CURRENT_TIMESTAMP), 'in progress'
),
(
   3, 3.0,
   (SELECT shipping FROM extra_charge WHERE weight >= 3.0),
   (SELECT handling FROM extra_charge WHERE weight >= 3.0),
   30.33, (SELECT CURRENT_TIMESTAMP), 'in progress'
);

INSERT INTO part_collection
(order_id, number, quantity) VALUES
(1, 1, 5),
(1, 2, 5),
(2, 3, 5),
(3, 2, 3);

-- ---------------------------------------------------------------------------80
CREATE DATABASE IF NOT EXISTS login_db;
USE login_db;

CREATE TABLE IF NOT EXISTS account (
   account_id INT PRIMARY KEY AUTO_INCREMENT,
   first_name CHAR(25) NOT NULL,
   last_name  CHAR(25) NOT NULL,
   password   CHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS position (
   position_id          INT PRIMARY KEY AUTO_INCREMENT,
   position_description CHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS position_collection (
   position_collection_id INT PRIMARY KEY AUTO_INCREMENT,
   position_id            INT NOT NULL,
   account_id             INT NOT NULL,
   FOREIGN KEY(position_id) REFERENCES position (position_id),
   FOREIGN KEY(account_id)  REFERENCES account (account_id)
);

-- fill tables

INSERT INTO account
(account_id, first_name, last_name, password) VALUES
(20, 'Nananne', 'Sophronia', 'password'),
(21,'Halette','Marlie','password'),
(22,'Gui','Lemuela','password');

INSERT INTO position
(position_id, position_description) VALUES
(1, 'administrator'),
(2, 'shipping worker'),
(3, 'receiving worker');

INSERT INTO position_collection
(account_id, position_id) VALUES
(21, 1);

DELIMITER //
FOR i IN 21 .. 22
DO
   INSERT INTO position_collection
   (account_id, position_id) VALUES
   (i,
      (
         SELECT position_id FROM position
         WHERE position_id <> 1
         ORDER BY RAND() LIMIT 1
      )
   );
END FOR;
//
DELIMITER ;

-- this is the db we are working with
USE customer_interaction_db;
