CREATE DATABASE IF NOT EXISTS filmodb;
USE filmodb;

CREATE TABLE IF NOT EXISTS films (
    tconst VARCHAR(20) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    tconst VARCHAR(20),
    rating TINYINT UNSIGNED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY (tconst) REFERENCES films(tconst) ON DELETE CASCADE
);

\copy films (tconst) FROM '/docker-entrypoint-initdb.d/tconst_list.txt';
