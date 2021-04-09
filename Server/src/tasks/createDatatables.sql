
DROP TABLE IF EXISTS tasks_occurences;
DROP TABLE IF EXISTS tasks;
DROP DOMAIN IF EXISTS week_num;
DROP DOMAIN IF EXISTS day_num;

CREATE TABLE tasks
(
    id INT PRIMARY KEY CHECK (id > 0),
    label VARCHAR NOT NULL,
    score INT NOT NULL CHECK (score > 0),
    importance INT NOT NULL CHECK (importance > 0),
    weekly_occurences INT NOT NULL CHECK (weekly_occurences > 0)
);


CREATE DOMAIN day_num AS integer CHECK (VALUE >= 0 AND VALUE <= 6);
CREATE DOMAIN week_num AS integer CHECK (VALUE >= 0 AND VALUE <= 53);


CREATE TABLE tasks_occurences
(
    id INT NOT NULL,
    calendar_week week_num NOT NULL,
    day day_num,
    UNIQUE(id,calendar_week),
    FOREIGN KEY (id) REFERENCES tasks(id)
);