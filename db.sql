

drop table if exists account;


create table account(
id serial primary key,
username varchar(20) not null,
email varchar(50) unique not null,
password varchar(255) not null);



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


--group tables start
drop table if exists GroupMembers;

CREATE TABLE GroupMembers (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES Groups(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (group_id, user_id) -- Prevents duplicate memberships in the same group
);



drop table if exists Groups;

CREATE TABLE Groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by INT NOT NULL REFERENCES account(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- group tables end