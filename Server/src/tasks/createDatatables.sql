DROP TABLE IF EXISTS tasks_occurences;
DROP TABLE IF EXISTS task_accomplishments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS users;
DROP DOMAIN IF EXISTS week_num;
DROP DOMAIN IF EXISTS day_num;


CREATE TABLE tasks
(
    id SERIAL PRIMARY KEY,
    label VARCHAR NOT NULL,
    score INT NOT NULL CHECK (score > 0),
    importance INT NOT NULL CHECK (importance > 0),
    weekly_occurences INT NOT NULL CHECK (weekly_occurences > 0),
    active BOOLEAN NOT NULL
);


CREATE DOMAIN day_num AS integer CHECK (VALUE >= 0 AND VALUE <= 6);
CREATE DOMAIN week_num AS integer CHECK (VALUE >= 0 AND VALUE <= 53);


CREATE TABLE tasks_occurences
(
    id INT NOT NULL,
    calendar_week week_num NOT NULL,
    day_of_week day_num,
    UNIQUE(id,calendar_week),
    FOREIGN KEY (id) REFERENCES tasks(id) ON DELETE CASCADE
);

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);


CREATE TABLE task_accomplishments
(
    id SERIAL PRIMARY KEY,
    task_id INT NOT NULL,
    user_id INT,
    calendar_week week_num NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


DROP TABLE IF EXISTS groceries;
DROP TABLE IF EXISTS grocery_cart;
DROP TABLE IF EXISTS grocery_types;
DROP DOMAIN IF EXISTS type_color;

CREATE DOMAIN type_color AS VARCHAR CHECK (VALUE ~ '^#[0-9|a-f]{2}[0-9|a-f]{2}[0-9|a-f]{2}$');

CREATE TABLE grocery_types 
(
    type VARCHAR PRIMARY KEY,
    color type_color NOT NULL 
);

INSERT INTO grocery_types VALUES ('Default' , '#555555');


CREATE TABLE groceries
(
    name VARCHAR PRIMARY KEY,
    type VARCHAR NOT NULL,
    FOREIGN KEY (type) REFERENCES grocery_types(type)
);


CREATE TABLE grocery_cart
(
    name VARCHAR PRIMARY KEY,
    type VARCHAR NOT NULL,
    amount VARCHAR,
    FOREIGN KEY (type) REFERENCES grocery_types(type)
);

