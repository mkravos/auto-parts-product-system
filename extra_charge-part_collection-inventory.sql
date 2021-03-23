CREATE TABLE extra_charge (
  weight   DOUBLE (5, 2) NOT NULL,
  shipping DOUBLE (5, 2) NOT NULL,
  handling DOUBLE (5, 2) NOT NULL,
  PRIMARY KEY (weight));
  
CREATE TABLE inventory (
  number INT NOT NULL PRIMARY KEY,
  quantity INT NOT NULL);
  
CREATE TABLE part_collection (
  part_collection_id INT PRIMARY KEY AUTO_INCREMENT,
  number INT NOT NULL,
  quantity INT NOT NULL,
  FOREIGN KEY (number) REFERENCES inventory(number));