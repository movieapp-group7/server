
-- account
drop table if exists account;

create table account(
id serial primary key,
username varchar(20),
email varchar(50) unique not null,
password varchar(255) not null);

ALTER TABLE account ADD COLUMN share_url VARCHAR(255) UNIQUE;
ALTER TABLE account ADD COLUMN is_public BOOLEAN DEFAULT TRUE;
ALTER TABLE account ADD COLUMN avatar BYTEA 

CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
ALTER TABLE account
ADD COLUMN country VARCHAR(100) DEFAULT NULL,
ADD COLUMN gender gender_type DEFAULT NULL,
ADD COLUMN birthday DATE DEFAULT NULL;

-----------------------------------------------------

--reviews
drop table if exists reviews;

CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER NOT NULL,
  account_id INTEGER REFERENCES account(id),
  email varchar(50) unique not null,
  comment TEXT NOT NULL,
  rating DECIMAL(2, 1),
  time TIMESTAMP NOT NULL
);
ALTER TABLE reviews DROP COLUMN email;
ALTER TABLE reviews DROP CONSTRAINT reviews_account_id_fkey;
ALTER TABLE reviews
ADD CONSTRAINT reviews_account_id_fkey
FOREIGN KEY (account_id)
REFERENCES account (id)
ON DELETE CASCADE;

----------------------------------------------------

--favorite
CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
  movie_id INTEGER NOT NULL,
  UNIQUE(account_id, movie_id)
);

-------------------------------------------------


--group 
CREATE TABLE groups (
  id SERIAL PRIMARY KEY,             
  name VARCHAR(50) NOT NULL UNIQUE,  
  owner_id INTEGER REFERENCES account(id) ON DELETE CASCADE, 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  description TEXT
);
ALTER TABLE groups
ADD COLUMN image BYTEA;


CREATE TABLE groupmembers (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE, 
  account_id INTEGER REFERENCES account(id) ON DELETE CASCADE, 
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_owner BOOLEAN DEFAULT FALSE, 
  is_approved BOOLEAN DEFAULT FALSE, 
  UNIQUE(group_id, account_id) 
);


CREATE TABLE groupcustom (
  id SERIAL PRIMARY KEY,                          
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,                         
  added_by INTEGER REFERENCES account(id) ON DELETE CASCADE,                         
  content_type VARCHAR(20) NOT NULL,                  
  content_id INTEGER NOT NULL,                        
  description TEXT,                                   
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groupshowtimes (
  id SERIAL PRIMARY KEY,                          
  group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,                          
  added_by INTEGER REFERENCES account(id) ON DELETE CASCADE,                         
  movie_title VARCHAR(255) NOT NULL,
  show_time TIMESTAMP NOT NULL,
  theatre VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP 
);

--------------------------------------------------
-- watchlist

DROP TABLE IF EXISTS watchlist;

CREATE TABLE watchlist (
    id SERIAL PRIMARY KEY,                      
    account_id INTEGER REFERENCES account(id) ON DELETE CASCADE,
    movie_id INTEGER NOT NULL,                 
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    UNIQUE(account_id, movie_id)               
);