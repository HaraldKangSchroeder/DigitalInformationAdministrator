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
    day day_num,
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
    task_id INT NOT NULL,
    user_id INT,
    calendar_week week_num NOT NULL,
    year INT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);