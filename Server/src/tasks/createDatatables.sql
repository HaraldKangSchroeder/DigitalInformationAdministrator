
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tasks_occurences;
DROP DOMAIN IF EXISTS week_num;
DROP DOMAIN IF EXISTS day_num;

CREATE TABLE tasks
(
    id INT PRIMARY KEY,
    label VARCHAR,
    score INT,
    IMPORTANCE INT
);


CREATE DOMAIN day_num AS integer CHECK (VALUE >= 0 AND VALUE <= 6);
CREATE DOMAIN week_num AS integer CHECK (VALUE >= 0 AND VALUE <= 53);


CREATE TABLE tasks_occurences
(
    id INT NOT NULL,
    calendar_week week_num,
    day day_num,
    frequency INT,
    UNIQUE(id,week_num),
    FOREIGN KEY (id) REFERENCES tasks(id)
);