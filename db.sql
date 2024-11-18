

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