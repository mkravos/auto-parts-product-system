-- SQL script to create order_collection and customer tables.

CREATE TABLE order_collection(
	order_collection_id 	int NOT NULL AUTO_INCREMENT,
	customer_id	    	int NOT NULL,
	order_id 	    	int NOT NULL,
	PRIMARY KEY(order_collection_id),
	FOREIGN KEY(customer_id) 	REFERENCES customer(customer_id),
	FOREIGN KEY(order_id) 		REFERENCES order(order_id)
);

CREATE TABLE customer(
	customer_id		int NOT NULL AUTO_INCREMENT,
	order_collection_id 	int NOT NULL,
	email			char(255) NOT NULL,
	first_name		char(255) NOT NULL,
	last_name 		char(255) NOT NULL,
	address			char(255) NOT NULL,
	PRIMARY KEY(customer_id),
	FOREIGN KEY(order_collection_id) REFERENCES order_collection(order_collection_id)
);