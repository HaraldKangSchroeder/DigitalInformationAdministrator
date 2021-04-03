
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS exercises_occurences;
DROP DOMAIN IF EXISTS week_num;
DROP DOMAIN IF EXISTS day_num;

CREATE TABLE exercises
(
    id INT PRIMARY KEY,
    label VARCHAR,
    score INT,
    IMPORTANCE INT
);


CREATE DOMAIN day_num AS integer CHECK (VALUE >= 0 AND VALUE <= 6);
CREATE DOMAIN week_num AS integer CHECK (VALUE >= 0 AND VALUE <= 53);


CREATE TABLE exercises_occurences
(
    id INT,
    week_num week_num,
    day_num day_num,
    UNIQUE(id,week_num),
    FOREIGN KEY (id) REFERENCES exercises(id)
);