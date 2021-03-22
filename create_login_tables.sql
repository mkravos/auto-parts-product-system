-- USE z1884999 ? --

CREATE TABLE account(
    account_id int NOT NULL AUTO_INCREMENT,
    position_collection_id NOT NULL,
    first_name char(255) NOT NULL,
    last_name char(255) NOT NULL,
    PRIMARY KEY(account_id, position_collection_id),
    FOREIGN KEY (position_collection_id) REFERENCES position_collection(position_collection_id)
);

CREATE TABLE position_collection(
    position_collection_id int PRIMARY KEY AUTO_INCREMENT,
    position_id int NOT NULL,
    account_id int NOT NULL,
    account_password char(255) NOT NULL,
    FOREIGN KEY(position_id) REFERENCES position(position_id),
    FOREIGN KEY(account_id) REFERENCES account(account_id)
);

CREATE TABLE position(
    position_id int PRIMARY KEY AUTO_INCREMENT,
    position_description char(255) NOT NULL
);