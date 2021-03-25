CREATE TABLE order_ (
   order_id                   INT PRIMARY KEY AUTO_INCREMENT,
   customer_id                INT NOT NULL,
   part_collection_id         INT NOT NULL, 
   weight                     DOUBLE(5, 2) NOT NULL,
   shipping                   DOUBLE(5, 2) NOT NULL, 
   handling                   DOUBLE(5, 2) NOT NULL, 
   charge_total               DOUBLE(5, 2) NOT NULL, 
   order_date                 TIMESTAMP NOT NULL,
   status                     CHAR(255) NOT NULL,
   FOREIGN KEY(customer_id)          REFERENCES customer(customer_id),
   FOREIGN KEY(part_collection_id)   REFERENCES part_collection(part_collection_id)
);
