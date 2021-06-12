BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS LoginDetails (
    ID SERIAL PRIMARY KEY NOT NULL,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);

COMMIT;